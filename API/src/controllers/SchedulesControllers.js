const schedule = require('../models/Schedules.js')
const { professorAvailable, teacherAvailableToScheduling } = require('../models/Professors.js')
const { totalScheduled, updateTotalScheduled } = require('../models/Timetables.js')
const { existDuplicateSchedule } = require('../models/Schedules.js')

module.exports = {
    async create(req, res, next) {
        const agendamento = req.body

        if (await teacherAvailableToScheduling(agendamento)) {
            res.status(400).send({ message: 'Professor(a) já possui agendamento!' })
            return
        }

        if (await existDuplicateSchedule(agendamento)) {
            res.status(400).send({ message: 'Aluno(a) já cadastrado(a) para aula!' })
            return
        }

        if (!await professorAvailable(agendamento.idProf)) {
            res.status(400).send({ message: 'Professor(a) indisponível para agendamentos!' })
            return
        }
        if (await totalScheduled(agendamento.diaSemana, agendamento.horario) === 10) {
            res.status(400).send({ message: 'Limite de agendamentos para o horário atigindo!' })
            return
        }
        updateTotalScheduled(agendamento.diaSemana, agendamento.horario, 'I')
        schedule.create(req, res, agendamento)
    },

    findAll(req, res, next) {
        schedule.findAll(req, res)
    },

    async update(req, res, next) {
        const agendamento = req.body
        const { id } = req.params
        const consultaAgenda = await schedule.getScheduleInfo(id)
        if (agendamento.statusAgenda === 'C') {
            updateTotalScheduled(agendamento.diaSemana, agendamento.horario, 'A')
        } else if (agendamento.statusAgenda === 'A' && agendamento.horario !== consultaAgenda.horario) {
            updateTotalScheduled(agendamento.diaSemana, consultaAgenda.horario, 'A')
            updateTotalScheduled(agendamento.diaSemana, agendamento.horario, 'I')
        }
        schedule.update(req, res, agendamento, id)
    },

    async delete(req, res, next) {
        const { id } = req.params
        const consultaAgenda = await schedule.getScheduleInfo(id)
        updateTotalScheduled(consultaAgenda.horario)
        schedule.delete(req, res, id)
    },

    findSchedule(req, res, next) {
        if (Object.keys(req.query).length > 0) {
            let registry = req.query.registry
            let id_prof = req.query.id_prof
            let id_curso = req.query.id_curso
            let data = req.query.data
            let hora = req.query.hora
            let id = req.query.id
            if (id) {
                schedule.findById(req, res, id)
            } else if (id_curso) {
                schedule.findByIdCurso(req, res, id_curso)
            } else if (registry) {
                schedule.findByRegistry(req, res, registry)
            } else if (data || hora) {
                schedule.findByDate(req, res, data, hora)
            } else if (id_prof) {
                schedule.findByIdProf(req, res, id_prof)
            }
        } else {
            schedule.findAll(req, res)
        }
    },

    findBySearchFilters(req, res, next) {
            let registry = req.query.matricula
            let student = req.query.aluno
            let professor = req.query.id_prof
            let date = req.query.data
            schedule.findBySearchFilters(req, res, registry, student, professor, date)
    }

}
const schedule = require('../models/Schedules.js')

module.exports = {
    create(req, res, next){
        const agendamento = req.body
        schedule.create(req, res, agendamento)
    },
    
    findAll(req, res, next){
        schedule.findAll(req, res)
    },
    
    update(req, res, next){
        const agendamento = req.body
        const { id } = req.params
        schedule.update(req, res, agendamento, id)
    },

    delete(req, res, next){
        const { id } = req.params
        schedule.delete(req, res, id)
    },

    findSchedule(req, res, next){
        if (Object.keys(req.query).length > 0) {
            let registry = req.query.registry
            let id_prof = req.query.id_prof
            let id_curso = req.query.id_curso
            let data = req.query.data
            let hora = req.query.hora
            let id = req.query.id
            if (id) {
                schedule.findById(req, res, id)
            } else if(id_curso) {
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
    }
    
}
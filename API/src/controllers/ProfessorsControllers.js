const professor = require('../models/Professors.js')
const validateCpf = require('cpf-cnpj-validator')
const { existsProfessorSchedule } = require('../models/Schedules.js')

module.exports = {
    async create(req, res, next) {
        const prof = req.body
        const cpf = prof.cpf

        if (await professor.existsProfessor(cpf)) {
            res.status(404).send({ message: 'Professor já cadastrado!' })
            return
        }

        professor.create(req, res, prof)

    },

    findProfessor(req, res, next) {
        let id
        let nome
        if (Object.keys(req.query).length > 0) {
            id = req.query.id_prof
            nome = req.query.nome_prof
        }

        professor.findByIdOrName(req, res, id, nome)
    },

    async update(req, res, next) {
        const prof = req.body
        let pk = req.query.cpf
        let filter

        if (validateCpf.cpf.isValid(pk)) {
            filter = `CPF: ${validateCpf.cpf.format(pk)}`
        } else {
            pk = req.query.id
            filter = `ID`
        }

        if (await professor.existsProfessor(pk)) {
            professor.update(req, res, pk, prof)
        } else {
            res.status(404).send({ message: `${filter} não existe!` })
        }

    },

    async delete(req, res, next) {
        let pk = req.query.cpf
        let filter

        if (validateCpf.cpf.isValid(pk)) {
            filter = `CPF: ${validateCpf.cpf.format(pk)}`
        } else {
            pk = req.query.id
            filter = `ID`
        }
        if (await professor.existsProfessor(pk)) {
            if (await existsProfessorSchedule(pk)) {
                res.status(400).send({ message: 'Existe agendamento ativo para o(a) professor(a)!' })
                return
            }
            professor.delete(req, res, pk)
        } else {
            res.status(404).send({ message: `${filter} não existe!` })
        }
    }

}


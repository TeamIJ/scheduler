const professor = require('../models/Professors.js')
const validateCpf = require('cpf-cnpj-validator')

module.exports = {
    async create(req, res, next) {
        const prof = req.body
        const cpf = prof.cpf

        if (!validateCpf.cpf.isValid(cpf)) {
            res.status(404).send({ message: 'CPF inválido' })
        } else {
            if (await professor.existsProfessor(cpf)) {
                res.status(404).send({ message: 'Professor já cadastrado!' })
                return
            }

            let id = await professor.create(prof)
            professor.insertProfessorCourse(id, prof)

            res.status(200).send({ message: 'Professor(a) incluído(a) com sucesso!' })
        }


    },

    findProfessor(req, res, next) {
        let nome
        let status
        if (Object.keys(req.query).length > 0) {
            nome = req.query.nome
            status = req.query.status_prof
        }

        professor.findByNameOrStatus(req, res, nome, status)
    },

    findProfessorByCourseId(req, res, next) {
        let id = req.params.id
        professor.findProfessorByCourseId(req, res, id)
    },

    findCoursesOfProfessor(req, res, next) {
        let id = req.params.id
        professor.findCoursesOfProfessor(req, res, id)
    },

    async update(req, res, next) {
        const prof = req.body
        const { id } = req.params

        professor.deleteAllProfessorsCourses(id)
        professor.insertProfessorCourse(id, prof)
        professor.update(req, res, id, prof)
    },

    async delete(req, res, next) {
        const { id } = req.params

        professor.deleteAllProfessorsCourses(id)
        professor.delete(req, res, id)

    }

}


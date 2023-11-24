const students = require('../models/Students.js')

module.exports = {
    create(req, res, next){
        const student = req.body
        students.create(req, res, student)
    },

    update(req, res, next){
        const student = req.body
        const { registry } = req.params
        students.update(req, res, student, registry)
    },

    delete(req, res, next){
        const { registry } = req.params
        students.delete(req, res, registry)
    },
    
    findStudent(req, res, next){
        let registry 
        let nome

        if (Object.keys(req.query).length > 0) {
            registry = req.query.registry
            nome = req.query.nome_aluno
        } 
        students.findByFilter(req, res, registry, nome)
    },

    existStudent(req, res, next){
        const {registry} = req.params
        students.existStudent(req, res, registry)
    }
}


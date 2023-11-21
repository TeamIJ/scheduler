const students = require('../models/Students.js')

module.exports = {
    create(req, res, next){
        const student = req.body
        students.create(req, res, student)
    },
    
    findAll(req, res, next){
        students.findAll(req, res)
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
        if (Object.keys(req.query).length > 0) {
            let registry = req.query.registry
            let nome = req.query.nome_aluno
            if (registry) {
                students.findByRegistry(req, res, registry)
            } else if(nome) {
                students.findByName(req, res, nome)
            }
        } else {
            students.findAll(req, res)
        }
    }
}


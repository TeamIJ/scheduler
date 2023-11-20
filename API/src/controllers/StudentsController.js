const students = require('../models/Students.js')

module.exports = {
    create(req, res, next){
        const student = req.body
        students.create(req, res, student)
    },
    
    findByRegistryOrName(req, res, next){
        const { params } = req.params
        students.findByRegistryOrName(req, res, params)
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
    }
    
}


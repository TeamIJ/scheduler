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
        students.findAll(res, res)
    },
    
    update(req, res, next){
        const student = req.body
        const { registry } = req.params
        students.update(res, req, student, registry)
    },

    delete(req, res, next){
        const { registry } = req.params
        students.delete(res, req, registry)
    }
    
}


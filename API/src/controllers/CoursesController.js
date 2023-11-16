const courses = require('../models/Courses.js')

module.exports = {
    create(req, res, next){
        const course = req.body
        courses.create(req, res, course)
    },
    
    findById(req, res, next){
        const { id } = req.params
        courses.findById(req, res, id)
    },
    
    findAll(req, res, next){
        courses.listAllCourses(req, res)
    },
    
    update(req, res, next){
        const { id } = req.params
        const course = req.body
        courses.update(req, res, id, course)
    },

    delete(req, res, next){
        const { id } = req.params
        courses.delete(req, res, id)
    }
    
}


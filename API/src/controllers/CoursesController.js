const courses = require('../models/Courses.js')
const { existsCourseSchedule } = require('../models/Schedules.js')
const { existsModulesCourses } = require('../models/Modules.js')

module.exports = {
    create(req, res, next){
        const course = req.body
        courses.create(req, res, course)
    },
    
    findByName(req, res, next){
        const { name } = req.params
        courses.findByName(req, res, name)
    },
    
    findAll(req, res, next){
        courses.listAllCourses(req, res)
    },
    
    update(req, res, next){
        const { id } = req.params
        const course = req.body
        courses.update(req, res, id, course)
    },

    async delete(req, res, next){
        const { id } = req.params
        if (await existsCourseSchedule(id)) {
            res.status(400).send({message:'Existe agendamento ativo para o curso!'})
            return
        }
        if (await existsModulesCourses(id)){
            res.status(400).send({message:'Existe(m) módulo(s) vinculado(s) ao curso!'})
            return
        }
        courses.delete(req, res, id)
    }
    
}
const timetables = require('../models/Timetables.js')

module.exports = {

    findAll(req, res, next){
        timetables.findAll(req, res)
    },

    findByDayAndTime(req, res, next){
        const timetable = req.body
        timetables.findByDayAndTime(req, res, timetable)
    },

    findByDay(req, res, next){
        const { day } = req.params
        timetables.findByDay(req, res, day)
    },

    update(req, res, next){
        const timetable = req.body
        timetables.update(req, res, timetable)
    }
    
}
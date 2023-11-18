const timetables = require('../models/Timetables.js')

module.exports = {

    findAll(req, res, next){
        timetables.findAll(req, res)
    },

    findByTime(req, res, next){
        const { time } = req.params
        timetables.findByTime(req, res, time)
    },

    update(req, res, next){
        const timetable = req.body
        const { time } = req.params
        timetables.update(req, res, time, timetable)
    }
    
}
const days = require('../models/Days.js')

module.exports = {

    findAll(req, res, next){
        days.findAll(req, res)
    },

    findByDay(req, res, next){
        const { day } = req.params
        days.findByTime(req, res, day)
    },

    update(req, res, next){
        const daysBody = req.body
        const { day } = req.params
        days.update(req, res, day, daysBody)
    }
    
}
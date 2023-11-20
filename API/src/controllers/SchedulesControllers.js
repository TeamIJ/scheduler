const schedule = require('../models/Schedules.js')

module.exports = {
    create(req, res, next){
        const agendamento = req.body
        schedule.create(req, res, agendamento)
    },
    
    findIdOrName(req, res, next){
        
    },
    
    findAll(req, res, next){
        schedule.findAll(req, res)
    },
    
    update(req, res, next){
        const agendamento = req.body
        const { id } = req.params
        schedule.update(req, res, agendamento, id)
    },

    delete(req, res, next){
        const { id } = req.params
        schedule.delete(req, res, id)
    }
    
}
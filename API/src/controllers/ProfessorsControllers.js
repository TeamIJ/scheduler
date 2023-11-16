const professor = require('../models/Professors.js')

module.exports = {
    create(req, res, next){
        const prof = req.body
        professor.create(req, res, prof)
    },

    findByIdOrName(req, res, next){
        const { param } = req.params
        professor.findByIdOrName(req, res, param)
    },
    
    findAll(req, res, next){
        professor.findAll(req, res)
    },
    
    update(req, res, next){
        const { id } = req.params
        const prof = req.body
        professor.update(req, res, id, prof)
    },

    delete(req, res, next){
        const { id } = req.params
        professor.delete(req, res, id)
    }
    
}


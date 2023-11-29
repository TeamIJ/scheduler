const modules = require('../models/Modules.js')

module.exports = {
    create(req, res, next){
        const module = req.body
        modules.create(req, res, module)
    },
    
    findById(req, res, next){
        const { id } = req.params
        modules.findById(req, res, id)
    },
    
    findAll(req, res, next){
        modules.listAllModules(req, res)
    },
    
    update(req, res, next){
        const { id } = req.params
        const module = req.body
        modules.update(req, res, id, module)
    },

    delete(req, res, next){
        const { id } = req.params
        modules.delete(req, res, id)
    }
    
}


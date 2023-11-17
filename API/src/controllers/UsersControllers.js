const users = require('../models/Users.js')

module.exports = {
    create(req, res, next){
        const user = req.body
        users.create(req, res, user)
    },
    
    findByName(req, res, next){
        const { usuario } = req.params
        users.findByName(req, res, usuario)
    },
    
    findAll(req, res, next){
        users.findAll(req, res)
    },
    
    update(req, res, next){
        const user = req.body
        const { usuario } = req.params
        users.update(req, res, usuario, user)
    },

    delete(req, res, next){
        const { usuario } = req.params
        users.delete(req, res, usuario)
    }
    
}
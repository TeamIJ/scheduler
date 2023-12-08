const users = require('../models/Users.js')
const { hash, compare } = require('bcryptjs')

async function authenticate(user) {

    if(users.exists(user)){
        const usuario = await users.getUserInfo(user.nome)
    
        const passwordMatch = await compare(user.senha, usuario.senha)
    
        return passwordMatch
    }

}

module.exports = {
    async create(req, res, next){
        const user = req.body
        const usuario = user.usuario

        if (await users.exists(usuario)) {
            res.status(404).send({message:'Usuário já cadastrado!'})
        } else {
            const passwordHash = await hash(user.senha, 8)
            user.senha = passwordHash
            users.create(req, res, user)
        }

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
    },

    async auth(req, res, next){
        const user = req.body

        if(await authenticate(user)){
            res.status(200).send({"ok": true})
        }else{
            res.status(404).send({"ok": false})
        }

    }
    
}
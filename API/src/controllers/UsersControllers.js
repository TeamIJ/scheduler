const users = require('../models/Users.js')
const { hash, compare } = require('bcryptjs')

async function authenticate(user) {

    const usuario = await users.getUserInfo(user.nome)

    if (!usuario){
        return { passwordMatch: false }
    }

    const passwordMatch = await compare(user.senha, usuario.senha)

    let userReturn = {
        user: usuario.usuario,
        role: usuario.tipo,
        name: usuario.nome
    }

    return { passwordMatch, userReturn }

}

function randomPassword() {
    let password = ''

    const caracters = 'ABCDEFGHIJKLMNOPQRSTUWWXYZ0123456789abcdefghijklmnopqrstuvwxyz'

    for (var i, i = 0; i < 6; i++) {
        password += caracters.charAt(Math.floor(Math.random() * caracters.length))
    }

    return password
}

module.exports = {
    async create(req, res, next) {
        const user = req.body
        const usuario = user.usuario

        if (await users.existsUsers(usuario)) {
            res.status(404).send({ message: 'Usuário já cadastrado!' })
            return
        }
        const passwordHash = await hash(user.senha, 8)
        user.senha = passwordHash
        users.create(req, res, user)
    },

    findByName(req, res, next) {
        const { usuario } = req.params
        users.findByName(req, res, usuario)
    },

    findAll(req, res, next) {
        users.findAll(req, res)
    },

    update(req, res, next) {
        const user = req.body
        const { usuario } = req.params
        users.update(req, res, usuario, user)
    },

    async updatePassword(req, res, next) {
        let user = req.body

        if (!user.reset) {
            if (!await authenticate(user)) {
                res.status(404).send({ "ok": false })
            }
        } else {
            user.novaSenha = randomPassword()
        }

        users.updatePassword(req, res, user)
    },

    delete(req, res, next) {
        const { usuario } = req.params
        users.delete(req, res, usuario)
    },

    async auth(req, res, next) {
        const user = req.body
        let response = await authenticate(user)
        if (response.passwordMatch) {
            res.status(200).send({ "ok": true, user: response.userReturn })
        } else {
            res.status(401).send({ "ok": false })
        }

    }

}
const users = require('../models/Users.js')
const fs = require('fs')

const config = JSON.parse(fs.readFileSync('C:\\temp\\config.json'))
const Cryptr = require('cryptr')
const cryptr = new Cryptr(`'${config.encryptKey}'`)

async function authenticate(user) {

    const usuario = await users.getUserInfo(user.nome)

    if (!usuario) {
        return { passwordMatch: false }
    }

    const senhaDescriptografada = cryptr.decrypt(usuario.senha)
    const passwordMatch = user.senha === senhaDescriptografada

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
        const passwordEncrypted = cryptr.encrypt(user.senha)
        user.senha = passwordEncrypted
        users.create(req, res, user)
    },

    findByName(req, res, next) {
        const { usuario } = req.params
        users.findByName(req, res, usuario)
    },

    findAll(req, res, next) {
        users.findAll(req, res)
    },

    findBySearchFilters(req, res, next) {
        let nome = req.query.nome
        let tipo = req.query.tipo
        users.findBySearchFilters(req, res, nome, tipo)
    },

    getUserPassword(req, res, next) {
        const { usuario } = req.params
        users.getUserPassword(req, res, usuario)
    },


    update(req, res, next) {
        const user = req.body
        const { usuario } = req.params
        users.update(req, res, usuario, user)
    },

    async updatePassword(req, res, next) {
        let user = req.body

        if (!user.reset) {
            let response = await authenticate(user)
            if (!response.passwordMatch) {
                res.status(404).send({ message: 'Senha atual inválida!' })
            } else {
                users.updatePassword(req, res, user)
            }
        } else {
            user.novaSenha = randomPassword()
            users.updatePassword(req, res, user)
        }
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
const connection = require('../config/db.js')
const fs = require('fs')

const config = JSON.parse(fs.readFileSync('C:\\temp\\config.json'))
const Cryptr = require('cryptr')
const cryptr = new Cryptr(`'${config.encryptKey}'`)

function hasData(data) {
    return data.length !== 0
}

module.exports = {
    
    create (_, res, user) {
        const query = `INSERT INTO USUARIOS (USUARIO, NOME, SENHA, TIPO) VALUES ('${user.usuario}', '${user.nome}', '${user.senha}', '${user.tipo}')`
        connection.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message: 'Usuário incluído com sucesso!'})
        })
    },

    findAll (_, res) {
        const query = 'SELECT USUARIO, TIPO FROM USUARIOS'
        connection.query(query, (err, data) => {
            if(err) console.error(err)
            if(!hasData(data)) {
                res.send({message:'Nenhum usuário cadastrado!'})
            } else {
                res.json(data)
            }
        })

    },

    findByName (_, res, usuario) {
        const query = `SELECT USUARIO, TIPO FROM USUARIOS WHERE USUARIO = '${usuario}'` 
        connection.query(query, (err, data) => {
            if(err) console.error(err)
            if(!hasData(data)) {
                res.send({message:'Usuário não encontrado!'})
            } else {
                res.json(data)
            }
        })
    },

    findBySearchFilters(req, res, nome, tipo){
        let query = 
            `SELECT USUARIO AS usuario, TIPO AS tipo, NOME AS nome FROM USUARIOS WHERE 1=1`
        if(nome){
            query += ` AND NOME LIKE '${nome}%'`
        }
        if(tipo && tipo !== 'T'){
            query += ` AND TIPO = '${tipo}'`
        }

        query += ' ORDER BY NOME '

        connection.query(query, async (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.json([])
            } else {
                res.json(data)
            }
        })
    },

    getUserPassword(req, res, usuario){
        const query = `SELECT SENHA FROM USUARIOS WHERE USUARIO = '${usuario}'` 
        connection.query(query, (err, data) => {
            if(err) console.error(err)
            if(!hasData(data)) {
                res.send([])
            } else {
                let pass = cryptr.decrypt(data[0].SENHA)
                let info = {
                    i: Buffer.from(pass).toString('base64')
                }
                res.json(info)
            }
        })
    },

    update (_, res, usuario, user) {
        const query = `UPDATE USUARIOS SET NOME = '${user.nome}', TIPO = '${user.tipo}' WHERE USUARIO = '${usuario}'`
  
        connection.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message: 'Usuário alterado com sucesso!'})
        })
    },

    async updatePassword(_, res, user){
        const query = 'UPDATE USUARIOS SET SENHA = ? WHERE USUARIO = ?'
        const novaSenha = cryptr.encrypt(user.novaSenha)
        connection.query(query, [novaSenha, user.nome, user.cpf], (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message: 'Senha alterada com sucesso!', newPassword: user.novaSenha})
        })
    },

    delete (_, res, usuario) {
        const query = `DELETE FROM USUARIOS WHERE USUARIO = '${usuario}'`
        connection.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message: 'Usuário deletado com sucesso!'})
        })
    },

    getUserInfo(userName){
        const query = `SELECT usuario, nome, senha, tipo FROM USUARIOS WHERE USUARIO COLLATE latin1_general_cs = '${userName}'`
        return new Promise((resolve) => {
            connection.query(query, (err, data) => {
                if(err) console.error(err)
                if(hasData) resolve(data[0])
            })
        })
    },
    
    existsUsers(user) {
        return new Promise((resolve) => {
            let query = `SELECT COUNT(*) count FROM USUARIOS WHERE USUARIO = '${user}'`

            connection.query(query, async(err, data) => {
                if(err) console.error(err)
                if(data[0].count === 0){
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    }

}
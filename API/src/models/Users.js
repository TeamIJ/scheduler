const connection = require('../config/db.js')
const { hash } = require('bcryptjs')

function hasData(data) {
    return data.length !== 0
}

module.exports = {
    
    create (_, res, user) {
        const query = `INSERT INTO USUARIOS (USUARIO, SENHA, TIPO) VALUES ('${user.usuario}', '${user.senha}', '${user.tipo}')`
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

    update (_, res, usuario, user) {
        const query = `UPDATE USUARIOS SET SENHA = '${user.senha}', TIPO = '${user.tipo}' WHERE USUARIO = '${usuario}'`
  
        connection.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message: 'Usuário alterado com sucesso!'})
        })
    },

    async updatePassword(_, res, user){
        const query = `UPDATE USUARIOS SET SENHA = '${await hash(user.novaSenha, 8)}' WHERE USUARIO = '${user.nome}'`
  
        connection.query(query, (err, _) => {
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

    getUserInfo(username){
        const query = `SELECT usuario, senha FROM USUARIOS WHERE USUARIO = '${username}'`
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
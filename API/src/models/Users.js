const connection = require('../config/db.js')
//const bcrypt = require("bcrypt")

function hasData(data) {
    return data.length !== 0
}

/*const bcrypt = require("bcrypt")

module.export = app => {
    const getPasswordHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const savePassword = (req, res) => {
        getPasswordHash(req.body.password, hash => {
            const password = hash

            app.db('USUARIOS').insert({usuario: req.body.usuario, password, tipo: req.body.tipo}).
                then(_ => res.status(204).send())
        })
    }
}
*/

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

    delete (_, res, usuario) {
        const query = `DELETE FROM USUARIOS WHERE USUARIO = '${usuario}'`
        connection.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message: 'Usuário deletado com sucesso!'})
        })
    }

}
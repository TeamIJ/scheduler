const e = require('express')
const connection = require('../config/db.js')
const validateCpf = require('cpf-cnpj-validator')

function hasData(data) {
    return data.length !== 0
}

module.exports = {

    create(_, res, professor){
        const query = 'INSERT INTO PROFESSORES (CPF_PROF, ID_CURSO, NOME, STATUS_PROF) VALUES (?, ?, ?, ?)'

        if (!validateCpf.cpf.isValid(professor.cpf)){
            res.send({message: 'CPF inválido'})
        }

        const args = [professor.cpf, professor.id_curso, professor.nome, professor.status]
        connection.query(query, args, (err, _) => {
            if(err) console.error(err)

            res.status(200).send({message: 'Professor incluído com sucesso!'})
        })
    },

    findByIdOrName(_, res, id, nome){
        let query = `SELECT * FROM PROFESSORES WHERE 1=1`
        let filter = []
        if (nome) {
            filter.push(nome)
            query = query + ` AND NOME LIKE '${nome}%'`
        }

        if (id) {
            filter.push(id)
            query = query + ` AND ID_PROF = '${id}'`
        }

        connection.query(query, filter, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send({message: 'Nenhum professor encontrado'}) 
            } else {
                res.json(data)
            }
        })
    },

    update(_, res, pk, professor){
        let query = `UPDATE PROFESSORES SET ID_CURSO = '${professor.id_curso}', NOME = '${professor.nome}', STATUS_PROF = '${professor.status}' WHERE `

        if (validateCpf.cpf.isValid(pk)) {
            query = query + `CPF_PROF = '${pk}'`
        } else {
            query = query + `ID_PROF = '${pk}'`
        }
        
        connection.query(query, (err, _) => {
            if (err) console.error(err)

            res.status(200).send({message: 'Professor alterado com sucesso!'})
        })
    },

    delete(_, res, pk){
        const query = `DELETE FROM PROFESSORES WHERE `

        if (validateCpf.cpf.isValid(pk)) {
            query = query + `CPF_PROF = '${pk}'`
        } else {
            query = query + `ID_PROF = '${pk}'`
        }

        connection.query(query, (err, _) => {
            if (err) console.error(err)

            res.status(200).send({message: 'Professor excluído com sucesso!'})
        })
    },

    existsProfessor(pk) {
        return new Promise((resolve) => {
            let query = `SELECT COUNT(*) count FROM PROFESSORES WHERE `    

            if (validateCpf.cpf.isValid(pk)) {
                query = query + `CPF_PROF = '${pk}'`
            } else {
                query = query + `ID_PROF = '${pk}'`
            }

            connection.query(query, async(err, data) => {
                if(err) console.error(err)
                if(data[0].count === 0 ){
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    }

}
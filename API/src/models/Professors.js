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

            res.status(200).send({message: 'Professor(a) incluído(a) com sucesso!'})
        })
    },

    findByIdOrName(_, res, id, status){
        let query = `SELECT DISTINCT ID_PROF, NOME, STATUS_PROF FROM PROFESSORES WHERE 1=1`
        let filter = []

        if (id) {
            filter.push(id)
            query = query + ` AND ID_PROF = '${id}'`
        }

        if(status && status !== 'T') {
            filter.push(status)
            query = query + ` AND STATUS_PROF = '${status}'`
        }

        connection.query(query, filter, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.json([]) 
            } else {
                res.json(data)
            }
        })
    },

    findProfessorByCourseId(_, res, id){
        const query = 'SELECT * FROM PROFESSORES WHERE ID_CURSO = ?'

        connection.query(query, id, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send([]) 
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

            res.status(200).send({message: 'Professor(a) alterado(a) com sucesso!'})
        })
    },

    delete(_, res, pk){
        let query = `DELETE FROM PROFESSORES WHERE `

        if (validateCpf.cpf.isValid(pk)) {
            query = query + `CPF_PROF = '${pk}'`
        } else {
            query = query + `ID_PROF = '${pk}'`
        }

        connection.query(query, (err, _) => {
            if (err) console.error(err)

            res.status(200).send({message: 'Professor(a) excluído(a) com sucesso!'})
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
    },

    professorAvailable(id){
        return new Promise((resolve) => {
            const query = 'SELECT COUNT(*) count FROM PROFESSORES WHERE ID_PROF = ? AND STATUS_PROF = ?'
            connection.query(query, [id, 'D'], async (err, data) => {
                if (err) console.error(err)
                if(data[0].count === 0){
                    resolve(false)
                }else{
                    resolve(true)
                }
            })
        })
    },

    teacherAvailableToScheduling(agendamento){
        return new Promise((resolve) => {
            const query = `SELECT COUNT(*) count FROM PROFESSORES P JOIN AGENDAMENTOS A ON (A.ID_PROF = P.ID_PROF) ` +
                        `WHERE P.ID_PROF = '${agendamento.idProf}' AND A.DATA_AULA = '${agendamento.dataAula}' AND A.HORARIO = '${agendamento.horario}' AND A.ID_CURSO <> '${agendamento.idCurso}'`
            connection.query(query, async (err, data) => {
                if (err) console.error(err)
                if(data[0].count === 0){
                    resolve(false)
                }else{
                    resolve(true)
                }
            })
        })
    }

}
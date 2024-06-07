const e = require('express')
const connection = require('../config/db.js')
const validateCpf = require('cpf-cnpj-validator')
const { includeProfessorCourse } = require('../controllers/ProfessorsControllers.js')

function hasData(data) {
    return data.length !== 0
}

module.exports = {

    create(professor){
        return new Promise((resolve) => { 

            let query = `INSERT INTO PROFESSORES (CPF_PROF, NOME, STATUS_PROF) VALUES (?, ?, ?)`

            let id = 0;
            const args = [professor.cpf, professor.nome, professor.status]
            id = connection.query(query, args, (err, data) => {
                if(err) console.error(err)
    
                resolve(data.insertId)
            })
        })
    },

    findByNameOrStatus(_, res, nome, status){
        let query = `SELECT ID_PROF, CPF_PROF, NOME, STATUS_PROF FROM PROFESSORES WHERE 1=1`
        let filter = []

        if (nome) {
            filter.push(nome)
            query = query + ` AND NOME LIKE '${nome}%'`
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
        const query = 
            `SELECT P.* FROM PROFESSORES P
            INNER JOIN PROFESSORES_CURSOS P_C ON P_C.ID_PROF = P.ID_PROF
            INNER JOIN CURSOS C ON C.ID_CURSO = P_C.ID_CURSO
            WHERE C.ID_CURSO = ?`

        connection.query(query, id, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send([]) 
            } else {
                res.json(data)
            }
        })
    },

    findCoursesOfProfessor(_, res, id){
        const query = 'SELECT ID_CURSO FROM PROFESSORES_CURSOS WHERE ID_PROF = ?'
        connection.query(query, id, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send([]) 
            } else {
                res.json(data)
            }
        })
    },

    update(_, res, id, professor){
        let query = `UPDATE PROFESSORES SET NOME = '${professor.nome}', STATUS_PROF = '${professor.status}' WHERE ID_PROF = ${id} `
        
        connection.query(query, (err, _) => {
            if (err) console.error(err)

            res.status(200).send({message: 'Professor(a) alterado(a) com sucesso!'})
        })
    },

    delete(_, res, id){
        let query = `DELETE FROM PROFESSORES WHERE ID_PROF = ${id} `

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
    },

    deleteAllProfessorsCourses(idProf){
        const query = `DELETE FROM PROFESSORES_CURSOS WHERE ID_PROF = '${idProf}'`
        connection.query(query, (err, _) => {
            if (err) console.error(err)
        })
    },

    includeProfessorCourse(id,  professor){
        let courses = professor.courses

        courses.forEach(course => {
            const query = `INSERT INTO PROFESSORES_CURSOS (ID_PROF, ID_CURSO) VALUES ('${id}', '${course}')`
            connection.query(query, (err, _) => {
                if (err) console.error(err)
            })
        })
    },

}
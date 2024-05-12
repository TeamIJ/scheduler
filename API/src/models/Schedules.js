const connection = require('../config/db.js')

function hasData(data) {
    return data.lenght !== 0
}

module.exports = {
    create(_, res, agenda) {
        const query = `INSERT INTO AGENDAMENTOS (ID_CURSO, ID_PROF, MATRICULA, ID_MODULO, HORARIO, AULA, DATA_AULA, LOGIN_USUARIO, DATA_ATUALIZACAO, STATUS_AGENDA, TIPO_AGENDAMENTO)` +
            `VALUES ('${agenda.idCurso}', '${agenda.idProf}', '${agenda.matricula}', '${agenda.idModulo}', '${agenda.horario}', '${agenda.aula}', '${agenda.dataAula}', '${agenda.login}', CURDATE(), '${agenda.statusAgenda}', '${agenda.tipoAgendamento}')`
        connection.query(query, (err, _) => {
            if (err) console.error(err)
            res.status(200).send({ message: 'Agendamento confirmado!' })
        })
    },

    findAll(_, res) {
        const query = `SELECT * FROM AGENDAMENTOS`
        connection.query(query, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send({ message: 'Não existe agendamento' })
            } else {
                res.json(data)
            }
        })
    },

    findById(req, res, id) {
        const query = `SELECT * FROM AGENDAMENTOS WHERE ID_AGENDA = '${id}'`
        connection.query(query, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send({ message: 'Não existe agendamento' })
            } else {
                res.json(data)
            }
        })
    },

    findByIdProf(req, res, idProf) {
        const query = `SELECT * FROM AGENDAMENTOS WHERE ID_PROF = '${idProf}'`
        connection.query(query, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send({ message: 'Não existe agendamento' })
            } else {
                res.json(data)
            }
        })
    },

    findByIdCurso(req, res, idCurso) {
        const query = `SELECT * FROM AGENDAMENTOS WHERE ID_CURSO = '${idCurso}'`
        connection.query(query, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send({ message: 'Não existe agendamento' })
            } else {
                res.json(data)
            }
        })
    },

    findByRegistry(req, res, registry) {
        const query = `SELECT * FROM AGENDAMENTOS WHERE MATRICULA = '${registry}'`
        connection.query(query, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send({ message: 'Não existe agendamento' })
            } else {
                res.json(data)
            }
        })
    },

    findBySearchFilters(req, res, registry, student, professor, date, status) {
        let query = 
        `SELECT A.ID_AGENDA AS id, AL.NOME AS aluno, P.NOME AS professor, C.NOME_CURSO AS curso, M.NOME_MODULO AS modulo,
         A.AULA AS aula, A.DATA_AULA AS data, A.HORARIO AS horario, A.TIPO_AGENDAMENTO AS tipo, A.ID_CURSO, A.ID_PROF, A.MATRICULA,
         A.ID_MODULO, A.STATUS_AGENDA AS status
         FROM AGENDAMENTOS A 
         INNER JOIN ALUNOS AL ON A.MATRICULA = AL.MATRICULA 
         INNER JOIN CURSOS C ON C.ID_CURSO = A.ID_CURSO
         INNER JOIN MODULOS M ON M.ID_CURSO = C.ID_CURSO AND M.ID_MODULO = A.ID_MODULO
         INNER JOIN PROFESSORES P ON A.ID_PROF = P.ID_PROF AND P.ID_CURSO = C.ID_CURSO
         WHERE 1=1`

        if(registry){
            query += ` AND A.MATRICULA LIKE '${registry}%' `
        }
        if(student){
            query += ` AND AL.NOME LIKE '${student}%' `
        }
        if(professor){
            query += ` AND P.ID_PROF = ${professor} `
        }
        if(date){
            query += ` AND A.DATA_AULA = '${date}' `
        }
        if(status && status !== "T"){
            query += ` AND A.STATUS_AGENDA = '${status}' `
        }

        query += ' ORDER BY A.STATUS_AGENDA, A.DATA_AULA, A.HORARIO '

        connection.query(query, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send({ message: 'Não existe agendamento' })
            } else {
                res.json(data)
            }
        })
    },

    findByDate(req, res, data, hora) {
        let query = `SELECT * FROM AGENDAMENTOS WHERE 1=1 `
        let filter = []
        if (data) {
            filter.push(data)
            query = query + `AND DATA_AULA = '${data}'`
        }
        if (hora) {
            filter.push(hora)
            query = query + `AND HORARIO = '${hora}'`
        }
        connection.query(query, filter, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send({ message: 'Não existe agendamento' })
            } else {
                res.json(data)
            }
        })
    },

    update(_, res, agenda, id) {
        const query = `UPDATE AGENDAMENTOS SET ID_PROF = '${agenda.idProf}', ID_MODULO = '${agenda.idModulo}', ID_CURSO = '${agenda.idCurso}',` +
            ` AULA = '${agenda.aula}', LOGIN_USUARIO = '${agenda.login}', DATA_ATUALIZACAO = CURDATE(), TIPO_AGENDAMENTO = '${agenda.tipoAgendamento}' WHERE ID_AGENDA = '${id}'`
        connection.query(query, (err, _) => {
            if (err) console.error(err)
            res.status(200).send({ message: 'Agendamento alterado com sucesso!' })
        })
    },

    updateStatus(_, res, agenda, id) {
        const query = `UPDATE AGENDAMENTOS SET LOGIN_USUARIO = '${agenda.login}', DATA_ATUALIZACAO = CURDATE(), STATUS_AGENDA = '${agenda.status}' WHERE ID_AGENDA = '${id}'`
        connection.query(query, (err, _) => {
            if (err) console.error(err)
            res.status(200).send({ message: 'Status alterado com sucesso!' })
        })
    },

    delete(_, res, id) {
        const query = `DELETE FROM AGENDAMENTOS WHERE ID_AGENDA = '${id}'`
        connection.query(query, (err, _) => {
            if (err) console.error(err)
            res.status(200).send({ mmessage: 'Agendamento excluído com sucesso' })
        })
    },

    existsModuleSchedule(idModulo) {
        return new Promise((resolve) => {
            const query = 'SELECT COUNT(*) count FROM AGENDAMENTOS WHERE ID_MODULO = ? AND STATUS_AGENDA = ?'
            connection.query(query, [idModulo, 'A'], async (err, data) => {
                if (err) console.error(err)
                if (data[0].count === 0) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    },

    existsProfessorSchedule(idProf) {
        return new Promise((resolve) => {
            const query = 'SELECT COUNT(*) count FROM AGENDAMENTOS WHERE ID_PROF = ? AND STATUS_AGENDA = ?'
            connection.query(query, [idProf, 'A'], async (err, data) => {
                if (err) console.error(err)
                if (data[0].count === 0) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    },

    getScheduleInfo(id) {
        return new Promise((resolve) => {
            const query = `SELECT HORARIO horario FROM AGENDAMENTOS WHERE ID_AGENDA = '${id}'`
            connection.query(query, (err, data) => {
                if (err) console.error(err)
                resolve(data[0])
            })
        })

    },

    existsStudentSchedule(registry) {
        return new Promise((resolve) => {
            const query = `SELECT COUNT(*) count FROM AGENDAMENTOS WHERE MATRICULA = '${registry}' AND  STATUS_AGENDA = 'A'`
            connection.query(query, async (err, data) => {
                if (err) console.error(err)
                if (data[0].count === 0) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    },

    existDuplicateSchedule (agendamento){
        return new Promise((resolve) => {
            const query = `SELECT COUNT(*) count FROM AGENDAMENTOS WHERE MATRICULA = '${agendamento.matricula}' `+
                        `AND STATUS_AGENDA = 'A' AND ID_CURSO = '${agendamento.idCurso}' AND TIPO_AGENDAMENTO = '${agendamento.tipoAgendamento}' AND ID_MODULO = '${agendamento.idModulo}' AND (AULA = ${agendamento.aula} OR HORARIO = '${agendamento.horario}')`
            connection.query(query, async (err, data) => {
                if (err) console.error(err)
                if (data[0].count === 0) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    },

    existsCourseSchedule(idCurso) {
        return new Promise((resolve) => {
            const query = `SELECT COUNT(*) count FROM AGENDAMENTOS WHERE ID_CURSO = '${idCurso}'`
            connection.query(query, async (err, data) => {
                if (err) console.error(err)
                if (data[0].count === 0) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    }

}
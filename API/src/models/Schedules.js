const connection = require('../config/db.js')

function hasData(data) {
    return data.lenght !== 0
}

module.exports = {
    create(_, res, agenda){
        const query = `INSERT INTO AGENDAMENTOS (ID_CURSO, ID_PROF, MATRICULA, ID_MODULO, HORARIO, AULA, DATA_AULA, LOGIN_USUARIO, DATA_ATUALIZACAO, STATUS_AGENDA, TIPO_AGENDAMENTO)` +
            `VALUES ('${agenda.idCurso}', '${agenda.idProf}', '${agenda.matricula}', '${agenda.idModulo}', '${agenda.horario}', '${agenda.aula}', '${agenda.dataAula}', '${agenda.login}', CURDATE(), '${agenda.statusAgenda}', '${agenda.tipoAgendamento}')`
        connection.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message:'Agendamento confirmado!'})
        })
    },
    
    findAll(_, res){
        const query = `SELECT * FROM AGENDAMENTOS`
        connection.query(query, (err, data) => {
            if(err) console.error(err)

            if(!hasData(data)) {
                res.send({message: 'Não existe agendamento'})
            } else {
                res.json(data)
            }
        })
    },

    findById(req, res, id){
        const query = `SELECT * FROM AGENDAMENTOS WHERE ID_AGENDA = '${id}'`
        connection.query(query, (err, data) => {
            if(err) console.error(err)

            if(!hasData(data)) {
                res.send({message: 'Não existe agendamento'})
            } else {
                res.json(data)
            }
        })
    },

    findByIdProf(req, res, idProf){
        const query = `SELECT * FROM AGENDAMENTOS WHERE ID_PROF = '${idProf}'`
        connection.query(query, (err, data) => {
            if(err) console.error(err)

            if(!hasData(data)) {
                res.send({message: 'Não existe agendamento'})
            } else {
                res.json(data)
            }
        })
    },

    findByIdCurso(req, res, idCurso){
        const query = `SELECT * FROM AGENDAMENTOS WHERE ID_CURSO = '${idCurso}'`
        connection.query(query, (err, data) => {
            if(err) console.error(err)

            if(!hasData(data)) {
                res.send({message: 'Não existe agendamento'})
            } else {
                res.json(data)
            }
        })
    },

    findByRegistry(req, res, registry){
        const query = `SELECT * FROM AGENDAMENTOS WHERE MATRICULA = '${registry}'`
        connection.query(query, (err, data) => {
            if(err) console.error(err)

            if(!hasData(data)) {
                res.send({message: 'Não existe agendamento'})
            } else {
                res.json(data)
            }
        })
    },

    findByDate(req, res, data, hora){
        let query = `SELECT * FROM AGENDAMENTOS WHERE 1=1 `
        let filter = []
        if (data){
            filter.push(data)
            query = query + `AND DATA_AULA = '${data}'`
        } 
        if (hora) {
            filter.push(hora)
            query = query + `AND HORARIO = '${hora}'`
        }
        connection.query(query, filter, (err, data) => {
            if(err) console.error(err)

            if(!hasData(data)) {
                res.send({message: 'Não existe agendamento'})
            } else {
                res.json(data)
            }
        })
    },

    update(_, res, agenda, id){
        const query = `UPDATE AGENDAMENTOS SET STATUS_AGENDA = '${agenda.statusAgenda}', DATA_AULA = '${agenda.dataAula}', ID_PROF = '${agenda.idProf}', ` +
                    ` HORARIO = '${agenda.horario}', LOGIN_USUARIO = '${agenda.login}', DATA_ATUALIZACAO = CURDATE() WHERE ID_AGENDA = '${id}'`
        connection.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message: 'Agendamento alterado com sucesso!'})
        })
    },

    delete(_, res, id){
        const query = `DELETE FROM AGENDAMENTOS WHERE ID_AGENDA = '${id}'`
        connection.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({mmessage:'Agendamento excluído com sucesso'})
        })
    },

    existsModuleSchedule(id){
        return new Promise((resolve) => {
            const query = 'SELECT COUNT(*) count FROM AGENDAMENTOS WHERE ID_MODULO = ? AND STATUS_AGENDA = ?'
            connection.query(query, [id, 'A'], async (err, data) => {
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
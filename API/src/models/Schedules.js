const connection = require('../config/db.js')

function hasData(data) {
    return data.lenght !== 0
}

module.exports = {
    create(_, res, agenda){
        //ID_AGENDA, ID_CURSO, ID_PROF, MATRICULA, ID_MODULO, ID_HORARIO, AULA, DATA_AULA, LOGIN_USUARIO, DATA_ATUALIZACAO, STATUS_AGENDA, TIPO_AGENDAMENTO
        const query = `INSERT INTO AGENDAMENTOS (ID_CURSO, ID_PROF, MATRICULA, ID_MODULO, HORARIO, AULA, DATA_AULA, LOGIN_USUARIO, DATA_ATUALIZACAO, STATUS_AGENDA, TIPO_AGENDAMENTO)` +
            `VALUES ('${agenda.idCurso}', '${agenda.idProf}', '${agenda.matricula}', '${agenda.idModulo}', '${agenda.horario}', '${agenda.aula}', '${agenda.dataAula}', '${agenda.login}', CURDATE(), '${agenda.statusAgenda}', '${agenda.tipoAgendamento}')`
        connection.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message:'Agendamento confirmado!'})
        })
    },

    findIdOrName(_, res){
    
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
    }

}
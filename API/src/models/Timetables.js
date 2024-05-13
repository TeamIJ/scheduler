const { query } = require('express')
const connection = require('../config/db.js')

module.exports = {

    findAll(_, res){
        const query = `SELECT * FROM HORARIOS`
        connection.query(query, (err, data) =>{
            if (err) console.error(err)

            res.json(data)
        })
    },

    findByDayAndTime(_, res, timetable){
        const query = `SELECT * FROM HORARIOS WHERE DIA_SEMANA = '${timetable.dayWeek}' AND HORARIO = '${timetable.time}'`
        connection.query(query, (err, data) =>{
            if (err) console.error(err)

            res.json(data)
        })
    },

    findByDay(_, res, Day){
        const query = `SELECT DIA_SEMANA, HORARIO, STATUS_HORARIO, STATUS_DIA, QTD_AGENDAMENTOS FROM HORARIOS WHERE DIA_SEMANA = '${Day}'`
        connection.query(query, (err, data) =>{
            if (err) console.error(err)

                res.json(data)
        })
    },

    update(_, res, timetable){
        const query = `UPDATE HORARIOS SET STATUS_HORARIO = '${timetable.status}' WHERE DIA_SEMANA = '${timetable.dayWeek}' AND HORARIO = '${timetable.time}'`
        connection.query(query, (err, _) => {
            if (err) console.error(err)

            res.status(200).send({message: 'Status do horário alterado com sucesso!'})
        })
    },

    totalScheduled(weekDay, time){
        return new Promise((resolve) => {
            const query = `SELECT QTD_AGENDAMENTOS qtd FROM HORARIOS WHERE DIA_SEMANA = '${weekDay}' AND HORARIO = '${time}'`
            connection.query(query, async (err, data) => {
                if (err) console.error(err)
                resolve(data[0].qtd)
            })
        })
    },

    updateTotalScheduled(weekDay, time, method){
        let column = `QTD_AGENDAMENTOS`
        const operation = method === 'I' ? `${column} + 1` : `${column} - 1`
        const query = `UPDATE HORARIOS SET QTD_AGENDAMENTOS = ${operation} WHERE DIA_SEMANA = '${weekDay}' AND HORARIO = '${time}'`
        connection.query(query, (err, _) => {
            if (err) console.error(err)
        })
    }
}
const connection = require('../config/db.js')

module.exports = {

    findAll(_, res){
        const query = `SELECT * FROM HORARIOS`
        connection.query(query, (err, data) =>{
            if (err) console.error(err)

            res.json(data)
        })
    },

    findByTime(_, res, time){
        const query = `SELECT * FROM HORARIOS where HORARIO = '${time}'`
        connection.query(query, (err, data) =>{
            if (err) console.error(err)

            res.json(data)
        })
    },

    update(_, res, time, timetable){
        const query = `UPDATE HORARIOS SET STATUS_HORARIO = '${timetable.status}' WHERE HORARIO = '${time}'`
        connection.query(query, (err, _) => {
            if (err) console.error(err)

            res.status(200).send({message: 'Status do horário alterado com sucesso!'})
        })
    },

}
const connection = require('../config/db.js')

module.exports = {

    findAll(_, res){
        const query = `SELECT * FROM DIAS_DISPONIVEIS`
        connection.query(query, (err, data) =>{
            if (err) console.error(err)

            res.json(data)
        })
    },

    findByDay(_, res, day){
        const query = `SELECT * FROM DIAS_DISPONIVEIS where DIA_SEMANA = '${day}'`
        connection.query(query, (err, data) =>{
            if (err) console.error(err)

            res.json(data)
        })
    },

    update(_, res, day, days){
        const query = `UPDATE DIAS_DISPONIVEIS SET DISPONIVEL = '${days.disponivel}' WHERE DIA_SEMANA = '${day}'`
        connection.query(query, (err, _) => {
            if (err) console.error(err)

            res.status(200).send({message: 'Dia alterado com sucesso!'})
        })
    },

}
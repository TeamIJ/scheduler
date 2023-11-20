const connection = require('../config/db.js')

function hasData(data) {
    return data.length !== 0
}

module.exports = {

    create(_, res, professor){
        const query = 'INSERT INTO PROFESSORES (CPF_PROF, ID_CURSO, NOME, STATUS_PROF) VALUES (?, ?, ?, ?)'
        const args = [professor.cpf, professor.id_curso, professor.nome, professor.status]
        connection.query(query, args, (err, _) => {
            if(err) console.error(err)

            res.status(200).send({message: 'Professor incluído com sucesso!'})
        })
    },


    findById(_, res, id){
        let query = `SELECT * FROM PROFESSORES WHERE ID_PROF = '${id}'`
       
        connection.query(query, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send({message: 'Nenhum professor encontrado'}) 
            } else {
                res.json(data)
            }
        })
    },

    findByName(_, res, nome){
        let query = `SELECT * FROM PROFESSORES WHERE NOME LIKE '${nome}%'`
       
        connection.query(query, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send({message: 'Nenhum professor encontrado'}) 
            } else {
                res.json(data)
            }
        })
    },

    findAll(_, res){
        const query = 'SELECT * FROM PROFESSORES'
        connection.query(query, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.send({message: 'Nenhum professor encontrado'}) 
            } else {
                res.json(data)
            }
        })
    },

    update(_, res, id, professor){
        const query = 'UPDATE PROFESSORES SET ID_CURSO = ?, NOME = ?, STATUS_PROF = ? WHERE ID_PROF = ?'
        const args = [professor.id_curso, professor.nome, professor.status, id]
        connection.query(query, args, (err, _) => {
            if (err) console.error(err)

            res.status(200).send({message: 'Professor alterado com sucesso!'})
        })
    },

    delete(_, res, id){
        const query = 'DELETE FROM PROFESSORES WHERE ID_PROF = ?'
        connection.query(query, id, (err, _) => {
            if (err) console.error(err)

            res.status(200).send({message: 'Professor excluído com sucesso!'})
        })
    }

}
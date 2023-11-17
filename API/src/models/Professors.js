const connection = require('../config/db.js')

function hasData(data) {
    return data.length !== 0
}

module.exports = {

    create(_, res, professor){
        const query = 'INSERT INTO PROFESSORES (ID_CURSO, NOME, STATUS_PROF) VALUES (?, ?, ?)'
        const args = [professor.id_curso, professor.nome, professor.status]
        connection.query(query, args, (err, _) => {
            res.status(200).send({message: 'Professor incluído com sucesso!'})
        })
    },


    findByIdOrName(_, res, param){
        let query = 'SELECT * FROM PROFESSORES WHERE '
        let filter = null
        if(parseInt(param)){
            query = query + ' ID_PROF = ? '
            filter = param
        } else {
            query = query + ' NOME LIKE ? '
            filter = `${param}%`
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
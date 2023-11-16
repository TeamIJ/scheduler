const connection = require('../config/db.js')

function hasData(data) {
    return data.length !== 0
}

module.exports = {

    create(_, res, course){
        const query = 'INSERT INTO CURSOS (NOME_CURSO) VALUES (?)'
        connection.query(query, course.nome_curso, (err, _) => {
            if (err) console.error(err)

            res.status(200).send({message: 'Curso incluído com sucesso!'})
        })
    },

    listAllCourses(_, res){
        const query = 'SELECT * FROM CURSOS'
        connection.query(query, (err, data) => {
            if (err) console.error(err)
            
            if (!hasData(data)){
                res.send({message: 'Nenhum curso encontrado'})
            } else {
                res.json(data)
            }
        })
    },

    findById(_, res, id){
        const query = 'SELECT * FROM CURSOS WHERE ID_CURSO = ?'
        connection.query(query, id, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)){
                res.send({message: 'Nenhum curso encontrado'})
            } else {
                res.json(data)
            }
        })
    },

    update(_, res, id, course){
        const query = 'UPDATE CURSOS SET NOME_CURSO = ? WHERE ID_CURSO = ?'
        connection.query(query, [course.nome_curso, id], (err, _) => {
            if (err) console.error(err)
            res.status(200).send({message: 'Curso alterado com sucesso!'})
        })
    },

    delete(_, res, id){
        const query = 'DELETE FROM CURSOS WHERE ID_CURSO = ?'
        connection.query(query, id, (err, _) => {
            if (err) console.error(err)
            res.status(200).send({message: 'Curso excluído com sucesso!'})
        })
    }

}

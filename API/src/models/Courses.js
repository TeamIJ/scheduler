const connection = require('../config/db.js')

function hasData(data) {
    return data.length !== 0
}

module.exports = {

    create(_, res, course){
        const id = course.nome_curso.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "")
        const query = 'INSERT INTO CURSOS (ID_CURSO, NOME_CURSO) VALUES (?,?)'

        connection.query(query, [id, course.nome_curso], (err, _) => {
            if (err) console.error(err)

            res.status(200).send({message: 'Curso incluído com sucesso!'})
        })
    },

    listAllCourses(_, res){
        const query = 'SELECT ID_CURSO as id, NOME_CURSO as curso FROM CURSOS'
        connection.query(query, (err, data) => {
            if (err) console.error(err)
            
            if (!hasData(data)){
                res.send({message: 'Nenhum curso encontrado'})
            } else {
                res.json(data)
            }
        })
    },

    findByName(_, res, name){
        const query = `SELECT ID_CURSO as id, NOME_CURSO as curso FROM CURSOS WHERE NOME_CURSO LIKE '${name}%'`
        connection.query(query, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)){
                res.send({message: 'Nenhum curso encontrado'})
            } else {
                res.json(data)
            }
        })
    },

    update(_, res, id, course){
    const newId = course.nome_curso.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "")
    const query = `UPDATE CURSOS SET ID_CURSO = '${newId}', NOME_CURSO = '${course.nome_curso}' WHERE ID_CURSO = '${id}'`
        connection.query(query, (err, _) => {
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

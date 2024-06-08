const connection = require('../config/db.js')

function hasData(data) {
    return data.length !== 0
}

module.exports = {

    create(_, res, module){
        const query = `INSERT INTO MODULOS (ID_MODULO, ID_CURSO, NOME_MODULO, QTD_AULAS) VALUES (LCASE(REPLACE(?, ' ', '')), ?, ?, ?)`

        const id = module.nome_modulo.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "")

        connection.query(query, [id, module.id_curso, module.nome_modulo, module.qtd_aulas], (err, _) => {
            if (err) console.error(err)

            res.status(200).send({message: 'Módulo incluído com sucesso!'})
        })
    },

    listAllModules(_, res){
        const query = 'SELECT * FROM MODULOS'
        connection.query(query, (err, data) => {
            if (err) console.error(err)
            
            if (!hasData(data)){
                res.send({message: 'Nenhum módulo encontrado'})
            } else {
                res.json(data)
            }
        })
    },

    findById(_, res, id){
        const query = 'SELECT * FROM MODULOS WHERE ID_MODULO = ?'
        connection.query(query, id, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)){
                res.send({message: 'Nenhum módulo encontrado'})
            } else {
                res.json(data)
            }
        })
    },

    findByModuleCourseId(_, res, idCurso){
        const query = 'SELECT * FROM MODULOS WHERE ID_CURSO = ?'
        connection.query(query, [idCurso], (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)){
                res.send([])
            } else {
                res.json(data)
            }
        })
    },

    findBySearchFilters(req, res, modulo, curso){
        let query = 
            `SELECT M.ID_MODULO as id, M.NOME_MODULO AS modulo, M.QTD_AULAS AS qtdAulas, C.NOME_CURSO AS curso, C.ID_CURSO
             FROM MODULOS M 
             INNER JOIN CURSOS C ON M.ID_CURSO = C.ID_CURSO
             WHERE 1=1`
        if(modulo){
            query += ` AND M.NOME_MODULO LIKE '%${modulo}%'`
        }
        if(curso){
            query += ` AND C.ID_CURSO = '${curso}'`
        }

        query += ' ORDER BY C.NOME_CURSO, M.NOME_MODULO '

        connection.query(query, (err, data) => {
            if (err) console.error(err)

            if (!hasData(data)) {
                res.json([])
            } else {
                res.json(data)
            }
        })
    },

    update(_, res, id, module){
        const newId = module.nome_modulo.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "")
        const query = 'UPDATE MODULOS SET ID_MODULO = ?, ID_CURSO = ?, NOME_MODULO = ?, QTD_AULAS = ? WHERE ID_MODULO = ?'
        connection.query(query, [newId, module.id_curso, module.nome_modulo, module.qtd_aulas, id], (err, _) => {
            if (err) console.error(err)
            res.status(200).send({message: 'Módulo alterado com sucesso!'})
        })
    },

    delete(_, res, id){
        const query = 'DELETE FROM MODULOS WHERE ID_MODULO = ?'
        connection.query(query, id, (err, _) => {
            if (err) console.error(err)
            res.status(200).send({message: 'Módulo excluído com sucesso!'})
        })
    },

    existsModules(id){
        return new Promise((resolve) => {
            const query = 'SELECT COUNT(*) count FROM MODULOS WHERE ID_MODULO = ?'
            connection.query(query, id, async (err, data) => {
                if (err) console.error(err)
                if(data[0].count === 0){
                    resolve(false)
                }else{
                    resolve(true)
                }
            })
        })
    },
    
    existsModulesCourses(idCurso){
        return new Promise((resolve) => {
            const query = 'SELECT COUNT(*) count FROM MODULOS WHERE ID_CURSO = ?'
            connection.query(query, idCurso, async (err, data) => {
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

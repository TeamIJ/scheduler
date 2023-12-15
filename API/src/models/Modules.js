const connection = require('../config/db.js')

function hasData(data) {
    return data.length !== 0
}

module.exports = {

    create(_, res, module){
        const query = `INSERT INTO MODULOS (ID_MODULO, ID_CURSO, NOME_MODULO, QTD_AULAS) VALUES (LCASE(REPLACE(?, ' ', '')), ?, ?, ?)`

        const id = module.nome_modulo.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

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

    update(_, res, id, module){
        const query = 'UPDATE MODULOS SET ID_CURSO = ?, NOME_MODULO = ?, QTD_AULAS = ? WHERE ID_MODULO = ?'
        connection.query(query, [module.id_curso, module.nome_modulo, module.qtd_aulas, id], (err, _) => {
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
    }   

}

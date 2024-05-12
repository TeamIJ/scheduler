const connection = require('../config/db.js')

function hasData(data){
    return data.lenght !== 0 
}

module.exports = {
    create(_, res, student){
        const query = `INSERT INTO ALUNOS (MATRICULA, NOME, STATUS_ALUNO) VALUES ('${student.matricula}', '${student.nome}', '${student.statusAluno}')`
        connection.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message:'Aluno incluído com sucesso!'})
        })
    },

    findByFilter(_, res, registry, nome, status){
        let query = `SELECT MATRICULA as matricula, NOME as nome, STATUS_ALUNO as status FROM ALUNOS WHERE 1=1 `
        let filter = []

        if(registry){
            filter.push(registry)
            query = query + ` AND MATRICULA LIKE '${registry}%'`
        }
        
        if(nome){
            filter.push(nome)
            query = query + ` AND NOME LIKE '${nome}%'`
        }

        if(status && status !== 'T'){
            filter.push(status)
            query = query + ` AND STATUS_ALUNO = '${status}'`
        }

        query = query + ' ORDER BY MATRICULA'
        
        connection.query(query, filter, (err, data) => {
            if(err) console.error(err)
            if(!hasData(data)){
                res.json([])
            } else {
                res.json(data)
            }
        })
    },

    update(_, res, student, registry){
        const query = `UPDATE ALUNOS SET NOME = '${student.nome}', STATUS_ALUNO = '${student.statusAluno}' WHERE MATRICULA = '${registry}'`
        connection.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message:'Aluno alterado com sucesso!'})
        })
    },

    delete(_, res, registry){
        const query = `DELETE FROM ALUNOS WHERE MATRICULA = '${registry}'`
        connection.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message:'Aluno excluído com sucesso!'})
        })
    },

    existStudent(registry){
        return new Promise ((resolve) => {
            let query = `SELECT COUNT(*) count FROM ALUNOS WHERE MATRICULA = '${registry}'`
            connection.query(query, async(err, data) => {
                if(err) console.error(err)
                if(data[0].count === 0){
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    },

    getStudentInfo(registry){
        const query = `SELECT matricula, nome FROM ALUNOS WHERE MATRICULA = '${registry}'`
        return new Promise((resolve) => {
            connection.query(query, (err, data) => {
                if(err) console.error(err)
                if(hasData) resolve(data[0])
            })
        })
    },

}
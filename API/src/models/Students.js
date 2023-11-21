const connetion = require('../config/db.js')

function hasData(data){
    return data.lenght !== 0 
}

module.exports = {
    create(_, res, student){
        const query = `INSERT INTO ALUNOS (ID_CURSO, MATRICULA, NOME, STATUS_ALUNO) VALUES ('${student.idCurso}', '${student.matricula}', '${student.nome}', '${student.statusAluno}')`
        connetion.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message:'Aluno incluído com sucesso!'})
        })
    },
    
    findAll(_, res) {
        const query = `SELECT * FROM ALUNOS`
        connetion.query(query, (err, data) => {
            if(err) console.error(err)
            if(!hasData(data)){
                res.send({message: 'Nenhum Aluno cadastrado!'})
            } else {
                res.json(data)
            }
        })
    },

    findByRegistry(_, res, registry){
        let query = `SELECT * FROM ALUNOS WHERE MATRICULA = '${registry}'`
        connetion.query(query, (err, data) => {
            if(err) console.error(err)
            if(!hasData(data)){
                res.send({message:'Aluno não encontrado!'})
            } else {
                res.json(data)
            }
        })
    },

    findByName(_, res, nome){
        let query = `SELECT * FROM ALUNOS WHERE NOME LIKE '${nome}%'`
        connetion.query(query, (err, data) => {
            if(err) console.error(err)
            if(!hasData(data)){
                res.send({message:'Aluno não encontrado!'})
            } else {
                res.json(data)
            }
        })
    },

    update(_, res, student, registry){
        const query = `UPDATE SET ALUNOS ID_CURSO = '${student.idCurso}', NOME = '${student.nome}', STATUS_ALUNO = '${student.statusAluno}' WHERE MATRICULA = '${registry}'`
        connetion.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message:'Aluno alterado com sucesso!'})
        })
    },

    delete(_, res, registry){
        const query = `DELETE FROM ALUNOS WHERE MATRICULA = '${registry}'`
        connetion.query(query, (err, _) => {
            if(err) console.error(err)
            res.status(200).send({message:'Aluno excluído com sucesso!'})
        })
    }
}
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

    findByFilter(_, res, registry, nome){
        let query = `SELECT * FROM ALUNOS WHERE 1=1 `
        let filter = []

        if(registry){
            filter.push(registry)
            query = query + ` AND MATRICULA = '${registry}'`
        }
        
        if(nome){
            filter.push(nome)
            query = query + ` AND NOME LIKE '${nome}%'`
        }

        connetion.query(query, filter, (err, data) => {
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
    },

    existStudent(_, res, registry){
        const query = `SELECT 1 FROM ALUNOS WHERE MATRICULA = '${registry}'`
        connetion.query(query, (err, result)=>{
            if(err) console.log(err)
            if(result == 0){
                res.send({message:'Aluno não existe!'})
            } else {
                res.status(200).send({message:'Aluno existe!'})
            }
        })

    }
}
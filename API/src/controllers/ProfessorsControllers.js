const professor = require('../models/Professors.js')
const validateCpf = require('cpf-cnpj-validator')

module.exports = { 
    async create(req, res, next){
        const prof = req.body
        const cpf = prof.cpf
        
        if(await professor.existsProfessor(cpf)){
            res.status(404).send({message: 'Professor já cadastrado!'})
        } else {
            professor.create(req, res, prof)
        }

    },

    findProfessor(req, res, next){
        let id
        let nome 
        if(Object.keys(req.query).length > 0) {
            id = req.query.id_prof
            nome = req.query.nome_prof
        }

        professor.findByIdOrName(req, res, id, nome)
    },
    
    async update(req, res, next){
        const prof = req.body
        let pk = req.query.cpf
        let filter
       
        if(validateCpf.cpf.isValid(pk)) {
            filter = `CPF: ${validateCpf.cpf.format(pk)}`
        } else {
            pk = req.query.id
            filter = `ID`
        }

        if(await professor.exists(pk)){
            professor.update(req, res, pk, prof)
        } else {
            res.status(404).send({message:`${filter} não existe!`})
        }

    },

    async delete(req, res, next){
        let pk = req.query.cpf
        let filter
       
        if(validateCpf.cpf.isValid(pk)) {
            filter = `CPF: ${validateCpf.cpf.format(pk)}`
        } else {
            pk = req.query.id
            filter = `ID`
        }
        if(await professor.exists(pk)){
            professor.delete(req, res, pk)
        } else {
            res.status(404).send({message:`${filter} não existe!`})
        }
    }
    
}


const students = require('../models/Students.js')
const { existsStudentSchedule } = require('../models/Schedules.js')

module.exports = {

    async auth(req, res, next){
        let { registry } = req.params
        const student = await students.getStudentInfo(registry)

        let studentReturn = {
            registry: student.matricula,
            name: student.nome.split(' ')[0],
            role: 'S'
        }

        if (student) {
            res.status(200).send({ "ok": true, "user": studentReturn})
        } else {
            res.status(401).send({ "ok": false })
        }
    },

    async create(req, res, next){
        const student = req.body
        const registry = student.matricula
        if(await students.existStudent(registry)) {
            res.status(404).send({message:'Aluno já cadastrado!'})
        } else {
            students.create(req, res, student)
        }

    },

    update(req, res, next){
        const student = req.body
        const { registry } = req.params
        students.update(req, res, student, registry)
    },

    async delete(req, res, next){
        const { registry } = req.params
        if (await existsStudentSchedule(registry)) {
            res.status(400).send({message:'Existe agendamento ativo para o aluno!'})
            return
        }
        students.delete(req, res, registry)

    },
    
    findStudent(req, res, next){
        let registry 
        let nome
        let status
        
        if (Object.keys(req.query).length > 0) {
            registry = req.query.registry
            nome = req.query.nome_aluno
            status = req.query.status
        } 
        students.findByFilter(req, res, registry, nome, status)
    },

    findStudentName(req, res, next){
        const { registry } = req.params
        students.findStudentName(req, res, registry)
    }
}


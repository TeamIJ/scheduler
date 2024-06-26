const modules = require('../models/Modules.js')
const { existsModuleSchedule } = require('../models/Schedules.js')

module.exports = {
    async create(req, res, next) {
        const module = req.body

        const nome = module.nome_modulo.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

        if (await modules.existsModules(nome.toLowerCase().replaceAll(' ', ''))) {
            res.status(404).send({ message: 'Módulo já cadastrado!' })
            return
        }

        modules.create(req, res, module)
    },

    findById(req, res, next) {
        const { id } = req.params

        modules.findById(req, res, id)
    },


    findByModuleCourseId(req, res, next) {
        const { id } = req.params
        modules.findByModuleCourseId(req, res, id)
    },

    findAll(req, res, next) {
        modules.listAllModules(req, res)
    },

    update(req, res, next) {
        const { id } = req.params
        const module = req.body
        modules.update(req, res, id, module)
    },

    async delete(req, res, next) {
        const { id } = req.params

        if (await existsModuleSchedule(id)) {
            res.status(404).send({ message: 'Existe agendamento ativo para o módulo!' })
            return
        }

        modules.delete(req, res, id)
    },

    findBySearchFilters(req, res, next) {
        let modulo = req.query.modulo
        let curso = req.query.curso
        modules.findBySearchFilters(req, res, modulo, curso)
    }

}


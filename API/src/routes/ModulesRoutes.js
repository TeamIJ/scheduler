module.exports = app => {
    const modules = require("../controllers/ModulesController.js")
  
    var router = require("express").Router()
  
    // Create a new courses
    router.post("/modules", modules.create)
  
    // Retrieve all modules
    router.get("/modules", modules.findAll)
  
    // Retrieve a single modules with id
    router.get("/modules/:id", modules.findById)

    // Retrieve list of modules by course id
    router.get("/modules/course/:id", modules.findByModuleCourseId)
  
    // Update a modules with id
    router.put("/modules/:id", modules.update)
  
    // Delete a modules with id
    router.delete("/modules/:id", modules.delete)
   
    app.use('/api/scheduler/', router)
  };
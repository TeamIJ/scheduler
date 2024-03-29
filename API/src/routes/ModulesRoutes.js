module.exports = app => {
    const module = require("../controllers/ModulesController.js")
  
    var router = require("express").Router()
  
    // Create a new courses
    router.post("/modules", module.create)
  
    // Retrieve all modules
    router.get("/modules", module.findAll)
  
    // Retrieve a single modules with id
    router.get("/modules/:id", module.findById)

    // Retrieve a single modules with id
    router.get("/modules/course/:id", module.findByCourseId)
  
    // Update a modules with id
    router.put("/modules/:id", module.update)
  
    // Delete a modules with id
    router.delete("/modules/:id", module.delete)
   
    app.use('/api/scheduler/', router)
  };
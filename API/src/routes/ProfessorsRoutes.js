module.exports = app => {
    const professor = require("../controllers/ProfessorsControllers.js")
  
    var router = require("express").Router()
  
    // Create a new professor
    router.post("/professor", professor.create)
  
    // Retrieve all professors
    router.get("/professor", professor.findAll)
  
    // Retrieve a single professor with id
    router.get("/professor/:id", professor.findOne)
  
    // Update a professor with id
    router.put("/professor/:id", professor.update)
  
    // Delete a professor with id
    router.delete("/professor/:id", professor.delete)
   
    app.use('/api/scheduler', router)
  };
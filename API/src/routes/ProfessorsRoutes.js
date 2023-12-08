module.exports = app => {
    const professor = require("../controllers/ProfessorsControllers.js")
  
    var router = require("express").Router()
  
    // Create a new professor
    router.post("/professor", professor.create)
  
    // Retrieve professors (filtering by id or name is possible too)
    router.get("/professor", professor.findProfessor)
  
    // Update a professor with id or cpf
    router.put("/professor", professor.update)
  
    // Delete a professor with id or cpf
    router.delete("/professor", professor.delete)
   
    app.use('/api/scheduler', router)
  };
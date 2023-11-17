module.exports = app => {
    const student = require("../controllers/StudentsController.js")
  
    var router = require("express").Router()
  
    // Create a new students
    router.post("/students", student.create)
  
    // Retrieve all studentss
    router.get("/students", student.findAll)
  
    // Retrieve a single students with id
    router.get("/students/:params", student.findByRegistryOrName)
  
    // Update a students with id
    router.put("/students/:registry", student.update)
  
    // Delete a students with id
    router.delete("/students/:registry", student.delete)
   
    app.use('/api/scheduler', router)
  };
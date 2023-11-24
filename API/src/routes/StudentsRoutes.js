module.exports = app => {
    const student = require("../controllers/StudentsController.js")
  
    var router = require("express").Router()
  
    // Create a new students
    router.post("/students", student.create)
  
    // Retrieve students (filtering by registry or name is possible too)
    router.get("/students/", student.findStudent)
  
    // Update a students with registry
    router.put("/students/:registry", student.update)
  
    // Delete a students with registry
    router.delete("/students/:registry", student.delete)

    // Exist student with registry
    router.get("/students/:registry", student.existStudent)
   
    app.use('/api/scheduler', router)
  };
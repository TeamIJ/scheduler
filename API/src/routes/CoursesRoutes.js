module.exports = app => {
    const course = require("../controllers/CoursesController.js")
  
    var router = require("express").Router()
  
    // Create a new courses
    router.post("/courses", course.create)
  
    // Retrieve all coursess
    router.get("/courses", course.findAll)
  
    // Retrieve a single courses with id
    router.get("/courses/:id", course.findOne)
  
    // Update a courses with id
    router.put("/courses/:id", course.update)
  
    // Delete a courses with id
    router.delete("/courses/:id", course.delete)
   
    app.use('/api/scheduler', router)
  };
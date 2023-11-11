module.exports = app => {
    const schedule = require("../controllers/SchedulesControllers.js")
  
    var router = require("express").Router()
  
    // Create a new schedules
    router.post("/schedules", schedule.create)
  
    // Retrieve all scheduless
    router.get("/schedules", schedule.findAll)
  
    // Retrieve a single schedules with id
    router.get("/schedules/:id", schedule.findOne)
  
    // Update a schedules with id
    router.put("/schedules/:id", schedule.update)
  
    // Delete a schedules with id
    router.delete("/schedules/:id", schedule.delete)
   
    app.use('/api/scheduler', router)
  };
module.exports = app => {
    const days = require("../controllers/DaysController.js")
  
    var router = require("express").Router()
  
    // Retrieve all times
    router.get("/days", days.findAll)
  
    // Retrieve a single day by index
    router.get("/days/:day", days.findByDay)
  
    // Update a day index
    router.put("/days/:day", days.update)
   
    app.use('/api/scheduler', router)
  };
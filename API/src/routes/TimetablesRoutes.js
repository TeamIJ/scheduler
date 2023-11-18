module.exports = app => {
    const timetables = require("../controllers/TimetablesController.js")
  
    var router = require("express").Router()
  
    // Retrieve all times
    router.get("/timetables", timetables.findAll)
  
    // Retrieve a single time with id
    router.get("/timetables/:time", timetables.findByTime)
  
    // Update a time with id
    router.put("/timetables/:time", timetables.update)
  
   
    app.use('/api/scheduler', router)
  };
module.exports = app => {
  const schedule = require("../controllers/SchedulesControllers.js")

  var router = require("express").Router()

  // Create a new schedules
  router.post("/schedules", schedule.create)

  // Retrieve scheduless (filtering by id or name is possible too)
  router.get("/schedules", schedule.findSchedule)

  // Retrieve scheduless (filtering by search page filters)
  router.get("/schedules/search", schedule.findBySearchFilters)

  // Update a schedules with id
  router.put("/schedules/:id", schedule.update)

  // Update status a schedules with id
  router.put("/schedules/status/:id", schedule.updateStatus)

  // Delete a schedules with id
  router.delete("/schedules/:id", schedule.delete)

  app.use('/api/scheduler', router)
};
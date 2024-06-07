module.exports = app => {
  const timetables = require("../controllers/TimetablesController.js")

  var router = require("express").Router()

  // Retrieve all times
  router.get("/timetables", timetables.findAll)

  // Retrieve a single time by day and time
  router.get("/timetables/day/time", timetables.findByDayAndTime)

  // Retrieve a list of time by day of week
  router.get("/timetables/:day", timetables.findByDay)

  // Retrieve calendar
  router.get("/timetables/calendar/info", timetables.getCalendarInfo)

  // Update all times
  router.put("/timetables/hours", timetables.updateHour)

  // Update all times
  router.put("/timetables/days", timetables.updateDays)

  app.use('/api/scheduler', router)
};
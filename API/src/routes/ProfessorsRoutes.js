module.exports = app => {
  const professor = require("../controllers/ProfessorsControllers.js")

  var router = require("express").Router()

  // Create a new professor
  router.post("/professor", professor.create)

  // Retrieve professors (filtering by id or name is possible too)
  router.get("/professor", professor.findProfessor)

  // Retrieve professors by course id
  router.get("/professor/course/:id", professor.findProfessorByCourseId)

  // Retrieve courses of professor
  router.get("/professor/courses/:id", professor.findCoursesOfProfessor)

  // Update a professor with id or cpf
  router.put("/professor/:id", professor.update)

  // Delete a professor with id or cpf
  router.delete("/professor/:id", professor.delete)

  app.use('/api/scheduler', router)
};
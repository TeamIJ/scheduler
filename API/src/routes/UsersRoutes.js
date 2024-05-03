module.exports = app => {
  const user = require("../controllers/UsersControllers.js")

  var router = require("express").Router()

  // Create a new users
  router.post("/users", user.create)

  // Retrieve all users
  router.get("/users", user.findAll)

  // Retrieve users by search filters
  router.get("/users/search", user.findBySearchFilters)

  // Retrieve a single users with name
  router.get("/users/:usuario", user.findByName)

  // Retrieve a base64 encoded user password
  router.get("/users/info/:usuario", user.getUserPassword)

  // Update a users with name
  router.put("/users/:usuario", user.update)

  // Update password of user
  router.post("/users/changepassword", user.updatePassword)

  // Delete a users with name
  router.delete("/users/:usuario", user.delete)

  router.post("/users/auth", user.auth)

  app.use('/api/scheduler', router)
};
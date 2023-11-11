module.exports = app => {
    const user = require("../controllers/UsersControllers.js")
  
    var router = require("express").Router()
  
    // Create a new users
    router.post("/users", user.create)
  
    // Retrieve all userss
    router.get("/users", user.findAll)
  
    // Retrieve a single users with id
    router.get("/users/:id", user.findOne)
  
    // Update a users with id
    router.put("/users/:id", user.update)
  
    // Delete a users with id
    router.delete("/users/:id", user.delete)
   
    app.use('/api/scheduler', router)
  };
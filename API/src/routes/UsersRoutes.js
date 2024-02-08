module.exports = app => {
    const user = require("../controllers/UsersControllers.js")
  
    var router = require("express").Router()
  
    // Create a new users
    router.post("/users", user.create)
  
    // Retrieve all userss
    router.get("/users", user.findAll)
  
    // Retrieve a single users with name
    router.get("/users/:usuario", user.findByName)
    
    // Update a users with name
    router.put("/users/:usuario", user.update)
    
    // Update password of user
    router.post("/users/changepassword", user.updatePassword)

    // Delete a users with name
    router.delete("/users/:usuario", user.delete)

    router.post("/users/auth", user.auth)
    
    app.use('/api/scheduler', router)
  };
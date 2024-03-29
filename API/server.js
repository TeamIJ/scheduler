const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")

const app = express()

var corsOptions = {
  origin: "http://localhost:3000 "
}

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json())

// simple route
app.get("/scheduler", (req, res) => {
  res.json({ message: "Welcome to Scheduler application." })
})

require("./src/routes/CoursesRoutes.js")(app)
require("./src/routes/ModulesRoutes.js")(app)
require("./src/routes/ProfessorsRoutes.js")(app)
require("./src/routes/SchedulesRoutes.js")(app)
require("./src/routes/StudentsRoutes.js")(app)
require("./src/routes/UsersRoutes.js")(app)
require("./src/routes/TimetablesRoutes.js")(app)
require("./src/routes/DaysRoutes.js")(app)

// set port, listen for requests
const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
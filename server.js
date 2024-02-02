const express = require("express")
const cors = require("cors")
const PORT = process.env.PORT || 8080
const db = require("./app/models")
const app = express()
const Tutorial = require('./app/routes/turorial.js')
const Role = require("./app/routes/role.js")
const User = require("./app/routes/user.js")
const auth = require("./app/routes/auth.js")


let corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Routes
app.use('/api/tutorials', Tutorial)
app.use('/api/role', Role)
app.use('/api/user', User)
app.use('/api/auth', auth)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
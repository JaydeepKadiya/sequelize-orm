const express = require("express")
const app = express()
const cors = require("cors")
const winston = require('winston')
let corsOptions = {
  origin: "http://localhost:8081"
};
const PORT = process.env.PORT || 8080
// models
const db = require("./models/index.js")

// imported routes
const Tutorial = require('./routes/turorial.js')
const Role = require("./routes/role.js")
const User = require("./routes/user.js")
const auth = require("./routes/auth.js")
const upload = require("./routes/upload.js")
  

// middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Routes
app.use('/api/tutorials', Tutorial)
app.use('/api/role', Role)
app.use('/api/user', User)
app.use('/api/auth', auth)
app.use('/api/upload', upload)





app.listen(PORT, () => {
  console.log(`App is running on port http://localhost:${PORT}.`)
})

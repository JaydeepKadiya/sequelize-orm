const express = require("express")
const cors = require("cors")
const PORT = process.env.PORT || 8080
const db = require("./models/index.js")
const app = express()

const Tutorial = require('./routes/turorial.js')
const Role = require("./routes/role.js")
const User = require("./routes/user.js")
const auth = require("./routes/auth.js")
const upload = require("./routes/upload.js")

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
app.use('/api/upload', upload)

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}.`)
})

const dbConfig = require("../config/db.config.js")

const Sequelize = require("sequelize")
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// db.tutorials = require("./tutorial.js")(sequelize, Sequelize)
// db.roles = require("./role.js")(sequelize,Sequelize)
// db.users = require("./user.js")(sequelize, Sequelize)
// db.otp = require("./otp.js")(sequelize, Sequelize)
db.file = require("./file.js")(sequelize, Sequelize)


db.sequelize.sync({ force: false })
  .then(() => {
    console.log("Synced db.")
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message)
  })

 
module.exports = db
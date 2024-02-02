const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController.js")

router.post("/",userController.createUser)

router.get("/list",userController.listUser)

router.get("/", userController.findOne)

router.post("/update",userController.updateUser)

router.delete("/delete",userController.deleteUser)

module.exports = router
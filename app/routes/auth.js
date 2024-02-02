const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController.js")

router.post("/login",authController.login)

router.post('/forgot-password',authController.forgotPassword)

router.post('/otp',authController.otpCheck)

router.post('/reset-password', authController.resetPassword)

module.exports = router
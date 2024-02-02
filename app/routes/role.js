const express = require("express")
const router = express.Router()
const roleController = require("../controllers/roleController.js")
const verifyToken = require("../middleware/verifyToken.js")
router.post("/", verifyToken, roleController.createRole)

router.get("/", verifyToken, roleController.findAll)

router.get("/:id", verifyToken, roleController.findOne)

router.put("/update", verifyToken, roleController.updateRole)

router.delete("/delete", verifyToken, roleController.deleteRole)

module.exports = router
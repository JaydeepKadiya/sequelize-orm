const express = require("express")
const router = express.Router()
const multer = require("multer")
const uploadController = require("../controllers/uploadController.js")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'app/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })


router.post("/", upload.single("file"), uploadController.uploadFile)

router.post("/multi", upload.array('files', 5),uploadController.uploadMultipleFiles)



module.exports = router
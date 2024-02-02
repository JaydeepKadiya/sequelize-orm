const db = require("../models");
const File = db.file;

const uploadFile = async (req, res) => {
    
    const file = req.file;
   
    if (!file) {
        return res.status(400).json({
            error: true,
            message: "No file uploaded"
        })
    }
    const { filename, path } = file;
    try {
        const fileId = await File.create({ filename, path });
        return res.status(200).json({
            error: false,
            message: "File Uploaded Successfully!!!!!!",
            data: fileId
        });
    } catch (err) {
        console.error("Error uploading file:", err);
        res.status(500).json({
            error: true,
            message: "Failed to upload file !!!!!!"
        });
    }
}


const uploadMultipleFiles = async (req, res) => {
    const files = req.files;
    const insertedFiles = [];

    for (const file of files) {
        const { filename, path } = file;
        try {
            const fileId = await File.create({ filename, path });
            insertedFiles.push(fileId);
        }
        catch (err) {
            console.error("Error inserting file:", err);
            res.status(500).json({
                error: true,
                message: "Failed to upload file !!!!!!"
            });
            return;
        }
    }

    res.status(200).json({
        error: false,
        message: "Files Uploaded Successfully!!!!!!",
        data : insertedFiles
    });
}

module.exports = {
    uploadFile,
    uploadMultipleFiles
}
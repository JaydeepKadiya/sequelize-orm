const db = require("../models");
const File = db.file;
const getFileStream = require("../s3.js");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const randomString = require("randomstring");
const crypto = require("crypto");
const AWS = require("aws-sdk");
const bucketName = "sequelize-orm-upload";

AWS.config.update({
  accessKeyId: "AKIAYS2NW4IFGRPQA5WN",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const uploadFile = async (req, res) => {
  const { filename, path } = req.file;
  try {
    const fileId = await File.create({ filename, path });
    return res.status(200).json({
      error: false,
      message: "File Uploaded Successfully!!!!!!",
      data: fileId,
    });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({
      error: true,
      message: "Failed to upload file !!!!!!",
    });
  }
};

const uploadMultipleFiles = async (req, res) => {
  const files = req.files;
  const insertedFiles = [];

  for (const file of files) {
    const { filename, path } = file;
    try {
      const fileId = await File.create({ filename, path });
      insertedFiles.push(fileId);
    } catch (err) {
      console.error("Error inserting file:", err);
      res.status(500).json({
        error: true,
        message: "Failed to upload file !!!!!!",
      });
      return;
    }
  }

  res.status(200).json({
    error: false,
    message: "Files Uploaded Successfully!!!!!!",
    data: insertedFiles,
  });
};

const uploadtoS3 = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }
  const filename = file.originalname;

  const mimeType = require("mime-types").lookup(file.originalname);

  if (!mimeType) {
    return res.status(400).send("Unable to determine MIME type.");
  }

  const extension = mimeType.split("/")[1];

  const randomString = crypto.randomBytes(10).toString("hex");

  const path = "uploads/" + randomString + "." + extension;

  const fileContent = fs.createReadStream(file.path);
  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Key: path,
    Body: fileContent,
  };

  s3.upload(params, async (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error uploading file to S3.");
    }
    const fileId = await File.create({ filename, path });

    res.status(200).send("File uploaded successfully to S3.\n" + fileId);
  });
};

const imageList = async (req, res) => {
  try {
    const FindRecord = await File.findAll();

    if (!FindRecord || FindRecord.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Record Not Found!!!",
        data: [],
      });
    }

    let obj = [];
    for (let i = 0; i < FindRecord.length; i++) {
      const params = {
        Bucket: bucketName,
        Key: FindRecord[i].path,
        Expires: 3600, // 1 hour
      };
      const s3 = new AWS.S3();
      const url = await s3.getSignedUrlPromise("getObject", params);
      obj.push(url);

      try {
        await fs.unlink(FindRecord[i].path);
      } catch (unlinkError) {
        console.error("Error unlinking file:", unlinkError);
        // console.log("File Path:" , FindRecord[i].path);

        // continue; 
      }
      FindRecord[i].path = url;
    }

    return res.status(200).json({
      error: false,
      message: "URL Fetched Successfully",
      data: {
        files: FindRecord,
      },
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      data: [],
    });
  }
};

const imageById = async (req, res) => {
  const id = req.params.id;
  const FindRecord = await File.findOne({ where: { id: id } });
  if (!FindRecord) {
    return res.status(404).json({
      error: true,
      message: "Record Not Found!!!",
      data: [],
    });
  }
  return res.status(200).json({
    error: false,
    message: "Record Fetched Successfully",
    data: FindRecord,
  });
}

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  uploadtoS3,
  imageList,
  imageById
};

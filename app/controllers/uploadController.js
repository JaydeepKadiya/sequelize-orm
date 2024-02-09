const db = require("../models");
const File = db.file;
const fs = require("fs");
const crypto = require("crypto");
const AWS = require("aws-sdk");
const logger = require("../logs/logger.js");
const bucketName = process.env.AWS_BUCKET_NAME;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadFile = async (req, res) => {
  const { filename, path } = req.file;
  try {
    const fileId = await File.create({ filename, path });
    logger.info("File uploaded successfully");
    return res.status(200).json({
      error: false,
      message: "File Uploaded Successfully!!!!!!",
      data: fileId,
    });
  } catch (err) {
    logger.error(`Error uploading file: ${err}`);
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
      logger.error(`Error inserting file: ${err}`);
      res.status(500).json({
        error: true,
        message: "Failed to upload file !!!!!!",
      });
      return;
    }
  }
  logger.info("Files uploaded successfully");
  res.status(200).json({
    error: false,
    message: "Files Uploaded Successfully!!!!!!",
    data: insertedFiles,
  });
};

const uploadtoS3 = async (req, res) => {
  const file = req.file;

  if (!file) {
    logger.error("No file uploaded.");
    return res.status(400).send("No file uploaded.");
  }
  const filename = file.originalname;

  const mimeType = require("mime-types").lookup(file.originalname);

  if (!mimeType) {
    logger.error("Unable to determine MIME type.");
    return res.status(400).send("Unable to determine MIME type.");
  }

  const extension = mimeType.split("/")[1];

  const randomString = crypto.randomBytes(10).toString("hex");

  const path = "uploads/" + randomString + "." + extension;

  const fileContent = fs.createReadStream(file.path);
  
  const params = {
    Bucket: bucketName,
    Key: path,
    Body: fileContent,
  };

  s3.upload(params, async (err, data) => {
    if (err) {
      logger.error(`Error uploading file to S3: ${err}`);
      return res.status(500).send("Error uploading file to S3.");
    }
    const fileId = await File.create({ filename, path });
    logger.info("File uploaded successfully to S3.");
    res.status(200).send("File uploaded successfully to S3.\n" + fileId);
  });
};

const fileList = async (req, res) => {
  try {
    const FindRecord = await File.findAll();

    if (!FindRecord || FindRecord.length === 0) {
      logger.error("Record Not Found!!!");
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
        logger.error(`Error unlinking file: ${unlinkError}`);
      }
      FindRecord[i].path = url;
    }
    logger.info("URLs fetched successfully");
    return res.status(200).json({
      error: false,
      message: "URL Fetched Successfully",
      data: {
        files: FindRecord,
      },
    });
  } catch (error) {
    logger.error(`Error generating signed URL: ${error}`);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      data: [],
    });
  }
};

const fileById = async (req, res) => {
  try {
    const id = req.params.id;
    const FindRecord = await File.findOne({ where: { id: id } });
    if (!FindRecord) {
      logger.error("Record Not Found!!!");
      return res.status(404).json({
        error: true,
        message: "Record Not Found!!!",
        data: [],
      });
    }

    const params = {
      Bucket: bucketName,
      Key: FindRecord.path,
      Expires: 3600, // 1 hour
    };
    const s3 = new AWS.S3();
    const url = await s3.getSignedUrlPromise("getObject", params);

      await fs.unlink(FindRecord.path, (unlinkError) => {
        if (unlinkError) {
          logger.error(`Error unlinking file: ${unlinkError}`);
        }
      });
  
    FindRecord.path = url;

    logger.info("Record fetched successfully");
    return res.status(200).json({
      error: false,
      message: "Record Fetched Successfully",
      data: FindRecord,
    });
  } catch (error) {
    logger.error(`Error fetching record: ${error}`);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      data: [],
    });
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  uploadtoS3,
  fileList,
  fileById,
};

const fs = require("fs")
const AWS = require("aws-sdk")
const dotenv = require("dotenv")
dotenv.config()

const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const region = process.env.AWS_REGION
const bucketName = process.env.AWS_BUCKET_NAME


const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey
});

// uploads file to s3

// module.exports = function upload(file) {
//     const fileContent = fs.createReadStream(file.path)

//     const params = {
//         Bucket: bucketName,
//         Key: file.filename,
//         Body: fileContent
//     }

//     return s3.upload(params)
// }

// download a file from s3
// module.exports = function getFileStream(key, res) {
//     const downloadParams = {
//         Bucket: bucketName,
//         Key: key,
//     };

//     const readStream = s3.getObject(downloadParams).createReadStream();

//     readStream.on('error', (err) => {
//         console.error(err);
//         res.status(500).send('Error retrieving image from S3.');
//     });

//     readStream.pipe(res);
// }
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require('path');

const s3 = new S3Client({
    credentials: {
        accessKeyId: "AKIA5CPF2XTCV6IK2VXX",
        secretAccessKey: "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"
    },
    region: "us-east-1" // this is the region that you select in AWS account
})

const s3Storage = multerS3({
    s3: s3, // s3 instance
    bucket: "test-prod-017", // change it as per your project requirement
    acl: "public-read", // storage access type
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

function sanitizeFile(file, cb) {
    const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true);
    } else {

        cb("Error: File type not allowed!");
    }
}

const uploadImage = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback)
    },
    limits: {
        fileSize: 1024 * 1024 * 2 // 2mb file size
    }
})

module.exports = uploadImage;
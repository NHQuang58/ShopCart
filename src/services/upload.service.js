const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { configAWS } = require('../config/configAWS');

aws.config.update({
  secretAccessKey: configAWS.AWS_SECRET_ACCESS_KEY,
  accessKeyId: configAWS.AWS_ACCESS_KEY_ID,
  region: configAWS.REGION,
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};
const fileFilterVideo = (req, file, cb) => {
  if (file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only mp4!'), false);
  }
};
const uploadImageService = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: configAWS.BUCKET,
    metadata(req, file, cb) {
      cb(null, { fieldName: 'TESTING_METADATA' });
    },
    key(req, file, cb) {
      cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`);
    },
  }),
});
const uploadVideoService = multer({
  fileFilter: fileFilterVideo,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: configAWS.BUCKET,
    metadata(req, file, cb) {
      cb(null, { fieldName: 'TESTING_METADATA' });
    },
    key(req, file, cb) {
      cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`);
    },
  }),
});
module.exports = {
  uploadImageService,
  uploadVideoService,
};

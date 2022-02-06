const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { uploadImageService, uploadVideoService } = require('../services/upload.service');

const singleUploadImage = uploadImageService.single('image');
const singleUploadVideo = uploadVideoService.single('video');
/**
 * Upload an image to AWS server
 */
const uploadImage = catchAsync(async (req, res) => {
  singleUploadImage(req, res, function (err) {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
    }
    return res.status(200).send({link: req.file.location});
  });
});

/**
 * Upload an video to AWS server
 */
const uploadVideo= catchAsync(async (req, res) => {
  singleUploadVideo(req, res, function (err) {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).send({ errors: [{ title: 'Video Upload Error', detail: err.message }] });
    }
    return res.status(200).send({link: req.file.location});
  });
});

module.exports = {
  uploadImage,
  uploadVideo,
};

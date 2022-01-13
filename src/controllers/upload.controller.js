const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const uploadService = require('../services/upload.service');

const singleUpload = uploadService.single('image');

/**
 * Upload an image to AWS server
 */
const uploadImage = catchAsync(async (req, res) => {
  singleUpload(req, res, function (err) {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
    }
    return res.status(200).send(req.file.location);
  });
});

module.exports = {
  uploadImage,
};

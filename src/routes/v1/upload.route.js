const express = require('express');

const router = express.Router();
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const uploadController = require('../../controllers/upload.controller');

router.post('/image-upload', auth('uploadImage'), uploadController.uploadImage);
router.post('/video-upload', auth('uploadVideo'), uploadController.uploadVideo);
module.exports = router;

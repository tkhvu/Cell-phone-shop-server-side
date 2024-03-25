const express = require('express');
const router = express.Router();
const {upload, uploadProductImage} = require('../controllers/uploadController');

router.post('/upload', upload.single('image'), uploadProductImage);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getCategory, deleteCategory, categoryUpdate } = require('../controllers/categoryController');



router.get('/getCategory', getCategory)
router.get('/deleteCategory', deleteCategory)
router.get('/categoryUpdate', categoryUpdate)



module.exports = router;
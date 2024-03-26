const express = require('express');
const router = express.Router();
const { deleteProduct, ProductUpdate, getMobile, MobileDetails } = require('../controllers/productController');



router.delete('/deleteProduct', deleteProduct)
router.get('/getMobile', getMobile);
router.get('/ProductUpdate', ProductUpdate)
router.get('/MobileDetails', MobileDetails)




module.exports = router;

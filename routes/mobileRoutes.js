const express = require('express');
const router = express.Router();
const { deleteProduct, ProductUpdate } = require('../controllers/productController');
const { getMobile, MobileDetails } = require('../controllers/mobileController');



router.delete('/deleteProduct', deleteProduct)
router.get('/getMobile', getMobile);

router.get('/ProductUpdate', ProductUpdate)

router.get('/MobileDetails', MobileDetails)




module.exports = router;

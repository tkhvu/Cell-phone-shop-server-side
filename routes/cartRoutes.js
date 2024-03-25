const express = require('express');
const router = express.Router();
const { emptyCart, getCart, addCart, UpdateTheCart } = require('../controllers/cartController');



router.get('/cartUpdate', UpdateTheCart)
router.get('/addCart', addCart)
router.get('/getCart', getCart)
router.get('/emptyCart', emptyCart)



module.exports = router;
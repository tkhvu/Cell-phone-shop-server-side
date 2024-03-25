const express = require('express');
const router = express.Router();
const { sendOrderConfirmationEmail } = require('../controllers/emailController');


router.post('/Emailorderconfirmation', sendOrderConfirmationEmail)


module.exports = router;
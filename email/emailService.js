
const nodemailer = require('nodemailer');
const { orderDetailsTemplate, calculateTotalCost } = require('./emailTemplates.js');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(firstname, lastname, email, orderedPhoneDetails, phone, City, Street, Housenumber, Apartmentnumber) {
  let totalCost = calculateTotalCost(orderedPhoneDetails); 
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: [process.env.ADMIN_EMAIL, email], 
    subject: 'הזמנה חדשה נוספה',
    html: orderDetailsTemplate(firstname, lastname, email, orderedPhoneDetails, phone, City, Street, Housenumber, Apartmentnumber, totalCost)
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = {
  sendEmail
};
// const { sendEmail } = require("../email/email");
// const jwt = require('jsonwebtoken');

// module.exports = {

// sendEmail : (req, res) => {
//     try {
//       const cookie = req.cookies["token"];
//       jwt.verify(cookie, process.env.JWT_SECRET);
  
//       const { firstname, lastname, email } = req.body.user;
//       const orderedPhoneDetails = req.body.orders;
//       const { phone, City, Street, Housenumber, Apartmentnumber } = req.body.DeliveryDetails;
//       sendEmail(firstname, lastname, email, orderedPhoneDetails, phone, City, Street, Housenumber, Apartmentnumber);
//       res.status(200).json('Email sent successfully');
//     } catch (e) {
//       console.error(e);
//       res.status(500).json({ error: e.message });
//     }
//   }
//  }

const { sendEmail: sendOrderEmail } = require("../email/emailService");
const jwt = require('jsonwebtoken');

exports.sendOrderConfirmationEmail = async (req, res) => {
    try {
        const cookie = req.cookies["token"];
        jwt.verify(cookie, process.env.JWT_SECRET);

        // if (!decoded) {
        //     return res.status(401).json({ error: 'Unauthorized' });
        // }
        
        // Consider adding data validation here
        const {user: {firstname, lastname, email,}, orders: orderedPhoneDetails, DeliveryDetails: { phone, City, Street, Housenumber, Apartmentnumber }} = req.body;

        await sendOrderEmail(firstname, lastname, email, orderedPhoneDetails, phone, City, Street, Housenumber, Apartmentnumber);
        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};




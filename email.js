const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'a0548453356@gmail.com',
        pass: 'lrofnyuokwwxyypw'
    }
});




function calculateTotalCost(orderedPhoneDetails) {
    let totalCost = 0;
    for (const phone of orderedPhoneDetails) {
        totalCost += phone.price * phone.count;
    }
    return totalCost;
}


const SENDMAIL = (firstname, lastname, email, orderedPhoneDetails, phone, City, Street, Housenumber, Apartmentnumber) => {

    const mailOptions = [
        {
            to: 'tkhvu3552@gmail.com', 
            subject: 'הזמנה חדשה נוספה', 
        },
        {
            to: email, 
            subject: 'פרטי ההזמנה ', 
        },
    ];
    
    
    mailOptions.forEach(options => {transporter.sendMail(
        {
            from: 'a0548453356@gmail.com',
            to: options.to,
            subject: options.subject,
            html: `
            <h2>פרטי ההזמנה</h2>
            <table style="border-collapse: collapse; width: 30%;">
            <tr>
                <th style="border: 1px solid black; padding: 8px;">מוצר</th>
                <th style="border: 1px solid black; padding: 8px;">כמות</th>
                <th style="border: 1px solid black; padding: 8px;">מחיר</th>
            </tr>
            ${orderedPhoneDetails.map(phone => `
            <tr>
                <td style="border: 1px solid black; padding: 8px;">${phone.name}</td>
                <td style="border: 1px solid black; padding: 8px;">${phone.count}</td>
                <td style="border: 1px solid black; padding: 8px;">${phone.price}</td>
            </tr>
            `).join('')}
            <tr>
            <td colspan="2" style="text-align: right; border: 1px solid black; padding: 8px;"><strong>סך הכול:</strong></td>
            <td style="border: 1px solid black; padding: 8px;"><strong>${calculateTotalCost(orderedPhoneDetails)}</strong></td>
            </tr>
        </table>


            <h2>פרטי הלקוח</h2>
            <table style="border-collapse: collapse; width: 70%;">
                <tr>
                    <td style="border: 1px solid black; padding: 8px;">שם פרטי</td>
                    <td style="border: 1px solid black; padding: 8px;">${firstname}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding: 8px;">שם משפחה</td>
                    <td style="border: 1px solid black; padding: 8px;">${lastname}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 8px;">אימייל</td>
                <td style="border: 1px solid black; padding: 8px;">${email}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 8px;">מספר פלאפון</td>
                <td style="border: 1px solid black; padding: 8px;">${phone}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 8px;">עיר</td>
                <td style="border: 1px solid black; padding: 8px;">${City}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 8px;">רחוב</td>
                <td style="border: 1px solid black; padding: 8px;">${Street}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 8px;">מספר בניין</td>
                <td style="border: 1px solid black; padding: 8px;">${Housenumber}</td>
                </tr>
                <tr>
                <td style="border: 1px solid black; padding: 8px;">מספר דירה</td>
                <td style="border: 1px solid black; padding: 8px;">${Apartmentnumber}</td>
                </tr>
            </table>
        
            `

        }, (error, info) => {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        })  });
};

module.exports = {
    SENDMAIL: SENDMAIL
};



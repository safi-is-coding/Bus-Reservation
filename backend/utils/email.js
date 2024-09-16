const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,      
        pass: process.env.EMAIL_PASS  
    }
});

// Send email function
exports.sendMail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL, // sender address
        to,                      // recipient address
        subject,                 // Subject line
        html: htmlContent        // HTML body content
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

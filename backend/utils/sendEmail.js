import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Or any other email service provider
        auth: {
            user: process.env.EMAIL, // Your email address
            pass: process.env.PASSWORD // Your email password or app password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,  // Sender's email address
        to: to,                        // Recipient's email address
        subject: subject,              // Subject of the email
        text: text                     // Body of the email
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error sending email:', error);
    }
};

export default sendEmail;

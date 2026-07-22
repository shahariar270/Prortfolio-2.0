const nodemailer = require('nodemailer');
const ApiResponse = require('../../utils/api_response');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

class contact_controller {
    async send_message(req, res) {
        try {
            const { name, email, content } = req.body;

            if (!name || !email || !content) {
                return ApiResponse.error(res, 'Name, email and message are required', 400);
            }

            const mailOptions = {
                from: process.env.MAIL_USER,
                replyTo: email,
                to: process.env.CONTACT_TO || process.env.MAIL_USER,
                subject: 'New Contact Form Message',
                text: `
নতুন একটি মেসেজ পেয়েছেন!

Name: ${name}
Email: ${email}
Message: ${content}
    `,
            };

            await transporter.sendMail(mailOptions);
            return ApiResponse.success(res, 'Email sent!');
        } catch (error) {
            return ApiResponse.error(res, 'Email failed', 500, error.message);
        }
    }
}

module.exports = new contact_controller;

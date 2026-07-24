const nodemailer = require('nodemailer');
const ContactMessage = require('../../model/contact_message');
const ApiResponse = require('../../utils/api_response');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    // 465 is implicit TLS; every other port (587, 2525, ...) starts plain
    // and upgrades via STARTTLS
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

class contact_controller {
    async send_message(req, res) {
        try {
            const { name, email, content } = req.body;

            if (!name || !email || !content) {
                return ApiResponse.error(res, 'Name, email and message are required', 400);
            }

            // stored first so the message (and the Contacts KPI) survives a
            // mail outage
            await ContactMessage.create({ name, email, content });

            const mailOptions = {
                from: `"${name} (${email})" <${process.env.EMAIL_ADDRESS}>`,
                replyTo: `"${name}" <${email}>`,
                to: process.env.EMAIL_ADDRESS,
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

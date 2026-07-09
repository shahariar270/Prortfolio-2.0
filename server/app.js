const express = require('express')
const app = express();
const cors = require('cors')
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors())

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

app.post("/contact", async (req, res) => {
    const { name, email, content } = req.body;

    const mailOptions = {
        from: `"${name} (${email})" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO ?? process.env.MAIL_USER,
        replyTo: `"${name}" <${email}>`,
        subject: "New Contact Form Message",
        text: `
নতুন একটি মেসেজ পেয়েছেন!

Name: ${name}
Email: ${email}
Message: ${content}
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email sent!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Email failed" });
    }
});



//home route
app.get('/', (req, res) => {
    res.send('request send successfully')
})

app.listen(PORT, () => {
    console.log(`server is ruing port ${PORT}`);
})



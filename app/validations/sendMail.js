const nodemailer = require("nodemailer")

const sendMail = async (email, content, res) => {
    try {
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: "Forget Password",
            text: content
        }

        await transport.sendMail(mailOptions)

        return res.status(200).json({
            error: false,
            message: " Reset Password Otp Sent Successfully!!  Please Check Your Email"
        }).end()

    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Email Could Not Be Sent!!!!",
            data: err.message,
        });
    }
}

module.exports = sendMail
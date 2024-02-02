const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: 'SMTP',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    }
})

const mailOptions = {
    from : 'your mail',
    to: email,
    subject:'Password Reset',
    text : 'Click Here to reset your password!'

}

module.exports = {
    transporter,
    mailOptions
}
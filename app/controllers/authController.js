const db = require("../models");
const User = db.users;
const OTP = db.otp;
const Joi = require("joi");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config()

const winston = require("../logs/logger.js")



const sendMail = require("../validations/sendMail.js");

const login = async (req, res) => {
    const { email, password } = req.body;
    const schema = Joi.object({
        email: Joi.string().email().min(10).max(50).required(),
        password: Joi.string().min(6).max(30).required()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
       logger.error(`Validation error: ${error.details.map(detail => detail.message).join(', ')}`);
            return res.status(400).json({
                error: true,
                message: error.details.map(detail => detail.message),
                data: []
            })
    }
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if (!user) {
            logger.error("User not found for email:", email);
            return res.status(404).json({
                error: true,
                message: "Email Not Found!!!"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            logger.error("Invalid password for email:", email);
            return res.status(400).json({
                error: true,
                message: "Invalid Password!!"
            })
        }
        const payload = {
            id: user.id,
            fname: user.firstName,
            lname: user.lastName,
            email: user.email,
            gender: user.gender,
            address: user.address,
        }

        const access = jwt.sign({
            payload, exp: Math.floor(Date.now() / 1000) + 2000
        }, process.env.ACCESS_TOKEN_SECRET)

        const refresh = jwt.sign({
            payload, exp: Math.floor(Date.now() / 1000) + 2300
        }, process.env.REFRESH_TOKEN_SECRET)

        logger.info("User logged in successfully:", email);
        return res.status(200).json({
            error: false,
            message: "User LoggedIn Successfully",
            data: {
                payload,
                access,
                refresh
            }
        })
    } catch (err) {
        logger.error("Internal Server Error:", err.message);
        res.status(500).json({
            error: true,
            message: "Error!!!!Internal Server Error!!",
            data: [err.message]
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const schema = Joi.object({
            email: Joi.string().email().required(),
        })
        const { error, value } = schema.validate(req.body)

        if (error) {
            logger.error("Validation Error:", error.details.map((detail) => detail.message));
            return res.status(400).json({
                error: true,
                message: "Validation Error",
                data: null
            })
        }
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            logger.error("User not found for email:", email);
            return res.status(404).json({
                error: true,
                message: "Email Not Found!!"
            }).end()
        }
        const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        let content = `Your One Time Password  is : " ${otp} " Do Not Share With Anyone`

        logger.info("Generated OTP for user:", { email: email, otp: otp });

        const emailResponse = sendMail(email, content, res)

        if (emailResponse.error) {
            logger.error("Error sending email:", emailResponse.error);
            return res.status(400).json(emailResponse)
        }
        const expireAt = new Date();
        expireAt.setHours(expireAt.getHours() + 1)

        // const userOtp = await knex(table)
        //     .where({ 'email': email })
        //     .first()
        const userOtp = await OTP.findOne({
            where: {
                email: email
            }
        })
        if (userOtp) {
            if (userOtp.otp !== otp) {
                await OTP.update({
                    otp
                }, {
                    where: {
                        email: email
                    }
                })
            } else {
                logger.error("OTP is already set and different:", { email: email, otp: otp });
                return res.status(400).json({
                    error: true,
                    message: "OTP is already set and different. Unable to update OTP."
                });
            }
        } else {
            await OTP.create({
                email,
                otp,
                expires_at: expireAt
            });
        }

        // if (userOtp == undefined) {
        //     // await knex(table).insert({
        //     //     email,
        //     //     otp,
        //     //     expires_at: expireAt
        //     await OTP.create({
        //         email,
        //         otp,
        //         expires_at: expireAt
        //     })
        // } else {
        //     if (userOtp.otp === 0) {
        //         // await knex(table)
        //         //     .where({ 'email': email })
        //         //     .update({ 'otp': otp })
        //         await OTP.update({
        //             otp
        //         }, {
        //             where: {
        //                 email: email
        //             }
        //         })
        //     }else{
        //         return res.status(400).json({
        //             error:true,
        //             message:"Unable to Update OTP"
        //         })
        //     }

        // }
    } catch (err) {
        logger.error("Internal Server Error:", err.message);
        return res.status(500).json({
            error: true,
            message: "Error!!!!Internal Server Error!!",
            data: [err.message]
        })
    }
}

const otpCheck = async (req, res) => {
    try {
        const otp = req.body.otp

        const schema = Joi.object({
            otp: Joi.number().min(100000).max(999999).required()
        })
        const { error } = schema.validate({ otp })

        if (error) {
            logger.error("Validation Error:", error.details.map((detail) => detail.message));
            return res.status(400).json({
                error: true,
                message: "Validation Error",
                data: null
            })
        }

        const user = await OTP.findOne({
            where: {
                otp: otp
            }
        })
        console.log(user)
        if (!user) {
            logger.error("Invalid OTP:", otp);
            return res.status(404).json({
                error: true,
                message: "Invalid OTP !! Please Provide Valid one-time-password!!!!"
            }).end()
        }

        if (user) {
            await OTP.update({
                otp: "0"
            }, {
                where: {
                    otp: otp
                }
            })
        }
        logger.info("OTP Verified Successfully:", otp);
        return res.status(200).json({
            error: false,
            message: "OTP Verified Successfully!!!!!"
        })
    } catch (err) {
        logger.error("Internal Server Error:", err.message);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error!!!!!",
            data: null
        })
    }
}


const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        const schema = Joi.object({
            email: Joi.string().email(),
            newPassword: Joi.string().min(6).max(12).required(),
            confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
        })
        const { error, value } = schema.validate(req.body)

        if (error) {
            logger.error("Validation Error:", error.details.map((detail) => detail.message));
            return res.status(400).json({
                error: true,
                message: "Validation Error",
                data: null
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        const [updatedRowsCount] = await User.update(
            { password: hashedPassword },
            { where: { email: email } }
        );

        if (updatedRowsCount === 0) {
            logger.error("Unable to reset password. User not found or no changes made.", { email: email });
            return res.status(400).json({
                error: true,
                message: "Unable to reset password. User not found or no changes made.",
                data: null
            });
        }


        logger.info("Password reset successfully for user:", email);

        const updatedUser = await User.findOne({ where: { email: email } });
        updatedUser.password = hashedPassword;
        await updatedUser.save();

        logger.info("Password reset successfully for user:", email);    
        return res.status(200).json({
            error: false,
            message: "Password reset successfully"
        })
    } catch (err) {
        logger.error("Internal Server Error:", err.message);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
            data: null
        })
    }
}
module.exports = { login, forgotPassword, otpCheck, resetPassword }
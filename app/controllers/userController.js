const db = require("../models");
const User = db.users;
const Joi = require("joi");
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    try {
        const { fname, lname, email, password, gender, address } = req.body;
        const data = {
            fname,
            lname,
            email,
            password,
            gender,
            address
        }

        const schema = Joi.object({
            fname: Joi.string().max(50).required(),
            lname: Joi.string().max(50).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6).max(255),
            gender: Joi.string().required().valid('Male', 'Female', 'Other'),
            address: Joi.string().required()
        })

        const { error, value } = schema.validate(data)

        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details.map((detail) => detail.message),
                data: []
            })
        }

        const userAvailable = await User.findOne({
            where: {
                email: email
            }
        })

        if (userAvailable !== null) {
            return res.status(400).json({
                error: true,
                message: "User already Registered",
                data: []
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fname,
            lname,
            email,
            password: hashedPassword,
            gender,
            address,
        })

        if (!user) {
            return res.status(400).json({
                error: true,
                message: "User Not Created",
                data: []
            })
        }

        return res.status(201).json({
            error: false,
            message: "User Created Successfully",
            data: {
                fname,
                lname,
                email,
                gender,
                address
            }
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Error!!!! Internal Server Error!!!",
            data: err.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id, fname, lname, email, gender, address, password } = req.body;
        const data = {
            id,
            fname,
            lname,
            email,
            gender,
            address
        }
        const schema = Joi.object({
            id: Joi.string().required(),
            fname: Joi.string().max(50).required(),
            lname: Joi.string().max(50).required(),
            email: Joi.string().email().required(),
            gender: Joi.string().required().valid('Male', 'Female', 'Other'),
            address: Joi.string().required()
        })

        const { error, value } = schema.validate(data)

        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details.map((detail) => detail.message),
                data: []
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.update({
            fname,
            lname,
            email,
            gender,
            address,
            password: hashedPassword
        }, {
            where: {
                id: id
            }
        })

        if (user == 0) {
            return res.status(404).json({
                error: true,
                message: `User with the id ${id} Not Found`,
                data: []
            })
        }

        return res.status(200).json({
            error: false,
            message: `User with the id : ${id} Updated Successfully`,
            data: {
                id,
                fname,
                lname,
                email,
                gender,
                address
            }
        })

    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Error!!!! Internal Server Error!!!",
            data: err.message
        })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.body;
    const schema = Joi.object({
        id: Joi.number().required().integer(),
    })

    const { error, value } = schema.validate({ id })
    if (error) {
        return res.json({
            error: true,
            message: error.details.map((detail) => detail.message),
            data: [],
        }).end()
    }

    const result = await User.destroy({
        where: { id: id }
    })

    if (result === 0) {
        return res.status(400).json({
            error: true,
            message: "User Not Found or Already Deleted"
        }).end()
    }

    return res.status(200).json({
        error: false,
        message: `Tutorial with the id :${id} Deleted Successfully!!!!`
    })
}

const listUser = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Validating page and pageSize
        if (page < 1 || pageSize < 1) {
            return res.status(400).json({
                error: true,
                message: "Invalid pagination parameters",
                data: []
            });
        }
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            offset: (page - 1) * pageSize,
            limit: pageSize
        });

        if (!users || users.length === 0) {
            return res.status(404).json({
                error: true,
                message: "Failed to list users",
                data: []
            });
        }

        return res.status(200).json({
            error: false,
            message: "Users listed successfully!!!",
            data: users
        });
    }catch(err) {
        return res.status(500).json({
            error: true,
            message: "Error!!!! Internal Server Error!!!",
            data: err.message
        });
    }
}

const findOne = async (req, res) => {
    const { id } = req.body;
    const schema = Joi.object({
        id: Joi.number().required().integer(),
    })

    const { error, value } = schema.validate({ id })
    if (error) {
        return res.json({
            error: true,
            message: error.details.map((detail) => detail.message),
            data: [],
        }).end()
    }
    try {
        const result = await User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: id
            }
        })
        if (!result) {
            return res.status(404).json({
                error: true,
                message: "User Not Found or Deleted!!!",
                data: []
            })
        }
        return res.status(200).json({
            error: false,
            message: `User With the id:${id} Fatched Successfully!!!!!`,
            data: result
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Error!!!! Internal Server Error!!!",
            data: err.message
        })
    }
}
module.exports = { createUser, updateUser, deleteUser, listUser , findOne }
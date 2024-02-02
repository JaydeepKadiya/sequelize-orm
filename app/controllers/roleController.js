const db = require("../models");
const Role = db.roles;
const Joi = require("joi");

const createRole = async (req, res) => {
    try {
        const { name, email, description, department, designation } = req.body;
        const schema = Joi.object({
            name: Joi.string().max(50).required(),
            email: Joi.string().email().required(),
            description: Joi.string().required(),
            department: Joi.string().required(),
            designation: Joi.string().required()
        })

        const { error } = schema.validate(req.body)

        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details.map((detail) => detail.message),
                data: []
            })
        }
        const roleAvailable = await Role.findOne({
            where: {
                email: email
            }
        })
        if (roleAvailable !== null) {
            return res.status(400).json({
                error: true,
                message: "Role already Registered",
                data: []
            })
        }
        const result = await Role.create({
            name,
            email,
            description,
            department,
            designation
        })
        if (!result) {
            return res.status(400).json({
                error: true,
                message: "Failed to Create Role",
                data: []
            })
        }
        return res.status(201).json({
            error: false,
            message: "Role Created Successfully!!!!!",
            data: result
        })
    } catch {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error!!!",
            data: []
        })
    }
}


const findAll = async (req, res) => {
    try {
        const result = await Role.findAll()

        if (!result) {
            return res.status({
                error: true,
                message: "Failed to List Roles",
                data: []
            })
        }
        return res.status(200).json({
            error: false,
            message: "Roles Fatched Successfully!!!!!",
            data: result
        })
    } catch {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error!!!",
            data: []
        })
    }
}

const findOne = async (req, res) => {
    const id = req.params.id
    try {
        const result = await Role.findOne({
            where: {
                id: id
            }
        })
        if (!result) {
            return res.status(404).json({
                error: true,
                message: "Role Not Found or Deleted!!!",
                data: []
            })
        }
        return res.status(200).json({
            error: false,
            message: `Roles With the id:${id} Fatched Successfully!!!!!`,
            data: result
        })
    } catch {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error!!!",
            data: []
        })
    }
}

const updateRole = async (req, res) => {
    try {
        // if (!req.validate("roles", "update")) {
        //     return false
        // }
        const schema = Joi.object({
            id: Joi.string().required().trim(),
            name: Joi.string().max(50).required(),
            email: Joi.string().email().required(),
            description: Joi.string().required(),
            department: Joi.string().required(),
            designation: Joi.string().required()
        }).options({ abortEarly: false })
        const { error, value } = schema.validate(req.body)
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details.map((detail) => detail.message),
                data: []
            })
        }
        const { id, name, email, description, department, designation } = value
        const result = await Role.update({ name, email, description, department, designation }, {
            where: { id: id }
        })
        console.log(result)
        if (result == 0) {
            return res.status(400).json({
                error: true,
                message: `Role with the id: ${id} Not Found`,
                data: []
            })
        }
        return res.status(200).json({
            error: false,
            message: `Role with the id ${id} Updated Successfully!!!!!!!`,
            data: {
                name,
                email,
                description,
                department,
                designation
            }
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Error!!!! Internal Server Error!!!",
        })
    }
}

const deleteRole = async (req, res) => {
    try {
        const { id } = req.body
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

        const result = await Role.destroy({
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

    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Error!!!! Internal Server Error!!!",
        })
    }
}

module.exports = { createRole, findAll, findOne, updateRole, deleteRole }
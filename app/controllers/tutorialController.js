const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;
const Joi = require("joi")

const createTutorial = async (req, res) => {
    const { title, description, published } = req.body
    try {
        const schema = Joi.object({
            title: Joi.string().max(70).required(),
            description: Joi.string().max(255).required(),
            published: Joi.string().required()
        })

        const { error } = schema.validate(req.body)

        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details.map((detail) => detail.message),
                data: []
            })
        }

        const titleAvailable = await Tutorial.findOne({
            where: {
                title: title
            }
        })
        if (titleAvailable !== null) {
            return res.status(400).json({
                error: true,
                message: "Title already Registered",
                data: []
            })
        }

        const result = await Tutorial.create({
            title,
            description,
            published
        })
        if (!result) {
            return res.status(400).json({
                error: true,
                message: "Failed to Create Record!!!",
                data: []
            })
        }
        return res.status(201).json({
            error: false,
            message: "Tutorial Created Successfully",
            data: {
                title,
                description,
                published
            }
        })

    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Error!!!! Internal Server Error!!!",
        })
    }
}

const findAll = async (req, res) => {
    try {
        const result = await Tutorial.findAll()
        return res.status(200).json({
            error: false,
            message: "Data Fatched Successfully!!!",
            data: result
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Error!!!! Internal Server Error!!!",
        })
    }
}

const findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Tutorial.findOne({
            where: {
                id: id
            }
        })
        if (!result) {
            return res.status(400).json({
                error: true,
                message: "Data Not Found Or Deleted",
                data: []
            })
        }
        return res.status(200).json({
            error: false,
            message: "Data Fatched Successfully",
            data: result
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Error!!!! Internal Server Error!!!",
        })
    }
}

const updateTutorial = async (req, res) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required().trim(),
            title: Joi.string().max(70).required(),
            description: Joi.string().max(255).required(),
            published: Joi.string().required()
        })
        const { error, value } = schema.validate(req.body)
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details.map((detail) => detail.message),
                data: []
            })
        }
        const { id, title, description, published } = value
        const result = await Tutorial.update({ title, description, published }, {
            where: { id: id }
        })
        console.log(result)
        if (result == 0) {
            return res.status(400).json({
                error: true,
                message: `Tutorial with the id: ${id} Not Found`,
                data: []
            })
        }
        return res.status(200).json({
            error: false,
            message: "Tutorial Updated Successfully!!!!!!!",
            data: {
                title,
                description,
                published
            }
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Error!!!! Internal Server Error!!!",
        })
    }
}

const deleteTutorial = async (req, res) => {
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

        const result = await Tutorial.destroy({
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

const deleteAll = async (req, res) => {
    try {
        const result = await Tutorial.destroy({
            where: {},
            truncate: false
        })
        if (result === 0) {
            return res.status(400).json({
                error: true,
                message: "User Not Found or Already Deleted"
            }).end()
        }
        return res.status(200).json({
            error: false,
            message: `Tutorials Deleted Successfully!!!!`
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Error!!!! Internal Server Error!!!",
        })
    }
}


const findAllPublished = async (req, res) => {
    try {
        const result = await Tutorial.findAll({
            where: {
                published: "true"
            }
        })
        console.log(result)
        if (result === 0) {
            return res.status(404).json({
                error: true,
                message: "No Published Data Found!!",
                data: []
            })
        }
        return res.status(200).json({
            error: false,
            message: "Tutorial with the Published Data Fatched Successfully",
            data: result
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Error!!!! Internal Server Error!!!"
        })
    }
}

module.exports = {
    createTutorial,
    findAll,
    findOne,
    updateTutorial,
    deleteTutorial,
    deleteAll,
    findAllPublished
}
const jwt = require("jsonwebtoken")
const dotenv =require("dotenv")
dotenv.config()

const verifyToken =  (req,res, next) => {
    const bearer = req.headers["authorization"]

    if(!bearer) {
        return res.status(400).json({
            error:true,
            message:"Error!!! Please Provide Bearer Token!!!"
        })
    }

    const token = bearer.split(" ")[1];

    if(!token) {
        return res.status(401).json({
            error:true,
            message: "Invalid Bearer Token Format!!"
        })
    }

    try{
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = data.payload
        next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: true,
                message: "Access Token Has Expired. Generate a New Token to Proceed"
            });
        }
        return res.status(401).json({
            error: true,
            message: "Invalid Token"
        });
    }
}

module.exports = verifyToken
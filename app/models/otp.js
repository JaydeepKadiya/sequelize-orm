module.exports = (sequelize, Sequelize) => {
    const OTP = sequelize.define("otp", {
        email:{
            type:Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail:true
            }
        },
        otp:{
            type:Sequelize.INTEGER
        },
        expires_at:{
            type:Sequelize.DATE
        }
    });
    return OTP;
}
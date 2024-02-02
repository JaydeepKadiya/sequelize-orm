module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        fname:{
           type: Sequelize.STRING
        },
        lname: {
            type: Sequelize.STRING
        },
        email:{
            type:Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail:true
            }
        },
        gender:{
            type:Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['Male', 'Female', 'Other']]
            }
        },
        password:{
            type:Sequelize.STRING
        },
        address:{
            type:Sequelize.STRING
        },
       
    },{
        timestamps: true
    });
    return User;
}
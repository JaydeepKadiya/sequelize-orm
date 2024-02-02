module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        name:{
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
        description:{
            type:Sequelize.STRING
        },
        department:{
            type:Sequelize.STRING
        },
        designation:{
            type:Sequelize.STRING
        }
    });
    return Role;
}
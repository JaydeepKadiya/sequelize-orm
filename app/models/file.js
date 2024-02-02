module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("file", {
        filename:{
            type:Sequelize.STRING,
        },
        path:{
            type:Sequelize.STRING
        }
    });
    return File;
}
const Sequelize = require("sequelize");
const { sequelizeInstance } = require("..");

class User extends Sequelize.Model {} 

User.init(
    {   
        id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        mail: {
            type: Sequelize.STRING,
        },
    },

    {sequelize: sequelizeInstance, underscored: true, modelName: "user"}   
)

module.exports = User;
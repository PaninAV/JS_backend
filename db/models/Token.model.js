const Sequelize = require("sequelize");
const { sequelizeInstance } = require("..");

class Token extends Sequelize.Model {} 

Token.init(
    {   
      value: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: ""
      }
    },

    {sequelize: sequelizeInstance, underscored: true, modelName: "token"}   
)

module.exports = Token;
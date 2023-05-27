const { Sequelize } = require ("sequelize")

const sequelizeInstance = new Sequelize({
    dialect: "sqlite",
    storage: "./sqliteData/database.sqlite",  
});
const initDB = async () => {
    try {
        await sequelizeInstance.authenticate();
        await sequelizeInstance.sync();
        console.log("Sequelize was initialized");
    } catch (error) {
        console.log("Sequelize ERROR (initDB)", error);
        process.exit();
    }
};

module.exports = {
    sequelizeInstance,
    initDB
};
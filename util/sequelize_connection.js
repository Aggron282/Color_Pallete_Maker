var mysql2 = require("mysql2");
var sequelize = require("sequelize");
const isLocal = process.env.NODE_ENV !== 'production';

const connection = new sequelize(
  isLocal ? process.env.LOCAL_DB_NAME || "colors" : process.env.DB_NAME || "colors",
  isLocal ? process.env.LOCAL_DB_USER || "root" : process.env.DB_USER || "root",
  isLocal ? process.env.LOCAL_DB_PASSWORD || "Linoone99!" : process.env.DB_PASSWORD || "Linoone99!",
  {
    dialect: "mysql",
    host: isLocal ? process.env.LOCAL_DB_HOST || "localhost" : process.env.DB_HOST,
    port: isLocal ? process.env.LOCAL_DB_PORT || 3306 : process.env.DB_PORT || 3306,
    logging: isLocal ? console.log : false, // Enables logging only in development
  }
);

module.exports = connection;

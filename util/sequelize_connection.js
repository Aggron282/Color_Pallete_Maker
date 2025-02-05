var mysql2 = require("mysql2");
var sequelize = require("sequelize");
const isLocal = process.env.NODE_ENV !== 'production';

var connection = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: "mysql",
  host: isLocal ? process.env.LOCAL_DB_HOST : process.env.DB_HOST,
  port: isLocal ? process.env.LOCAL_DB_PORT : process.env.DB_PORT
});


module.exports = connection;

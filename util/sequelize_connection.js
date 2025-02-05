var mysql2 = require("mysql2");
var sequelize = require("sequelize");

var options = {
  config:{
    host: isLocal ? process.env.DB_HOST: process.env.DB_HOST,
    user: isLocal ? process.env.LOCAL_DB_USER : process.env.DB_USER,
    password: isLocal ? process.env.LOCAL_DB_PASSWORD : process.env.DB_PASSWORD,
    database: isLocal ? process.env.LOCAL_DB_NAME : process.env.DB_NAME,
    port: isLocal ? process.env.DB_PORT : process.env.DB_PORT
  }
}
var connection = new sequelize("colors","root","Linoone99!",{
  dialect:"mysql",
  host:process.env.DB_HOST
});

module.exports = connection;

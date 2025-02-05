var mysql2 = require("mysql2");
var sequelize = require("sequelize");

var connection = new sequelize("colors","root","Linoone99!",{
  dialect:"mysql",
  host:process.env.DB_HOST
});

module.exports = connection;

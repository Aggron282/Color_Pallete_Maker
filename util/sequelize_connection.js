var mysql2 = require("mysql2");
var sequelize = require("sequelize");

var connection = new sequelize("colors","root","Linoone99!",{
  dialect:"mysql",
  host:"localhost"
});

module.exports = connection;

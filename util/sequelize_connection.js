var mysql2 = require("mysql2");
var sequelize = require("sequelize");
const isLocal = process.env.NODE_ENV !== 'production';

var connection = new sequelize("colors","root","Linoone99!",{
  dialect:"mysql",
  host:isLocal ? process.env.LOCAL_DB_HOST : process.env.DB_HOST
});

module.exports = connection;

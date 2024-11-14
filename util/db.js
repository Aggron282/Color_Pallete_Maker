var mysql = require("mysql2");
var config = {
  host:"localhost",
  user:"root",
  password:"Linoone99!",
  database: "colors"
}


module.exports = mysql.createPool(config).promise();

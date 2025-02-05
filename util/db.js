var mysql = require("mysql2");

require('dotenv').config();

const isLocal = process.env.NODE_ENV !== 'production';

var options = {

    host: isLocal ? process.env.DB_HOST: process.env.DB_HOST,
    user: isLocal ? process.env.LOCAL_DB_USER : process.env.DB_USER,
    password: isLocal ? process.env.LOCAL_DB_PASSWORD : process.env.DB_PASSWORD,
    database: isLocal ? process.env.LOCAL_DB_NAME : process.env.DB_NAME,
    port: isLocal ? process.env.LOCAL_DB_PORT : process.env.DB_PORT

}
//
// var config = {
//   host:"localhost",
//   user:"root",
//   password:"Linoone99!",
//   database: "colors"
// }



module.exports = mysql.createPool(options).promise();

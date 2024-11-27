var sequelize = require("sequelize");
var Sequelize = require("./../util/sequelize_connection.js");

var User = Sequelize.define("user",{
    name : sequelize.STRING,
    username : sequelize.STRING,
    password : sequelize.STRING,
    profileImg : sequelize.STRING,
    email : sequelize.STRING,
    user_id : {
      type: sequelize.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true
    },
  });


module.exports = User;

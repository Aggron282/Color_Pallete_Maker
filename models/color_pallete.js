var sequelize = require("sequelize");
var Sequelize = require("./../util/sequelize_connection.js");

var Pallete = Sequelize.define("pallete",{
    name : sequelize.STRING,
    image : sequelize.STRING,
    category : sequelize.STRING,
    rgbList : sequelize.STRING,
    isViewable : sequelize.BOOLEAN,
    customRGBList:sequelize.STRING,
    pallete_id : {
      type: sequelize.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true
    },
    user_id : {
      type: sequelize.INTEGER,
      allowNull:false,
      foreignKey:true
    }
  });


module.exports = Pallete;

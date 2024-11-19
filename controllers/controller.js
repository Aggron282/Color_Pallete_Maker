var path = require("path");
var rootDir = path.dirname(require.main.filename);
var color_util = require("./../util/colors.js");
const formidable = require('formidable');
const bcrypt = require("bcrypt")
const mysql_util = require("./../util/mysql.js");

const GetMainPage = (req,res) => {
  res.render(path.join(rootDir,"views","index.ejs"));
}

const GetLoginPage = (req,res) => {
  res.render(path.join(rootDir,"views","auth","login.ejs"));
}

const GetCreateAccountPage = (req,res) => {
  res.render(path.join(rootDir,"views","auth","create_account.ejs"));
}

const CreateAccount = async (req,res) => {

  var {name,username,password,profileImg} = req.body;

  var encrypt = await bcrypt.hash(password,12);

  var data = [
    {
      col:"name",
      value:name
    },
    {
      col:"username",
      value:username
    },
    {
      col:"password",
      value:password.toString()
    },
    {
      col:"profileImg",
      value:profileImg
    }
  ];

  mysql_util.InsertInto("user",data)

}

const PostExtractColor = async (req,res) => {

  var img_file = req.file;
  var dirname = path.join(rootDir,"images");
  var src_name = "";
  var image_name = "";

  if(img_file){
    const color_data = await color_util.ExtractColorFromImage(img_file.path);
    res.json({colors:color_data,image:img_file.path});
  }
  else{
    res.json(false);
  }

  return;

}

module.exports.CreateAccount = CreateAccount;
module.exports.GetMainPage = GetMainPage;
module.exports.GetLoginPage = GetLoginPage;
module.exports.GetCreateAccountPage = GetCreateAccountPage;
module.exports.PostExtractColor = PostExtractColor;

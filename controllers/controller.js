var path = require("path");
var rootDir = path.dirname(require.main.filename);
var color_util = require("./../util/colors.js");
const formidable = require('formidable');
const bcrypt = require("bcrypt")
const mysql_util = require("./../util/mysql.js");
const {validationResult} = require("express-validator");

const GetMainPage = (req,res) => {
  res.render(path.join(rootDir,"views","index.ejs"));
}

const GetLoginPage = (req,res) => {
  res.render(path.join(rootDir,"views","auth","login.ejs"));
}

const GetCreateAccountPage = (req,res) => {
  res.render(path.join(rootDir,"views","auth","create_account.ejs"));
}

const GetDashboardPage = (req,res) => {
  res.render(path.join(rootDir,"views","user","dashboard.ejs"),{user:req.user,path:"/dashboard"});
}

const GetAddPage = (req,res) => {
  res.render(path.join(rootDir,"views","user","add.ejs"),{user:req.user,path:"/add"});
}


const Login = async (req,res) => {

    var {username,password} = req.body;
    mysql_util.findUser(username,(data) => {
    if(data.length <= 0){
      res.json({feedback:false,err_msg:"No User Found"});
      return;
    }else{
      var user = data[0];
      console.log(password,user.password)

      if(password !== user.password){
        res.json({feedback:false,err_msg:"Incorrect User/Password"})
      }else{
        req.session.user = user;
        res.json({feedback:true,err_msg:null,user});
      }
    }

  });

}

const CreateAccount = async (req,res) => {

  var {name,username,password} = req.body;

  var errors = validationResult(req);

  errors = errors.array();

  if(errors.length > 0){
    res.json({feedback:false,err_msg:"Validation Error", validation_errors:errors})
    return;
  }

  mysql_util.findUser(username,async (found_user)=>{
    console.log(found_user)
    if(found_user[0].length > 0){
      console.log("User Already Exists");
      res.json({feedback:false, err_msg: "User Already Exists"})
      return;
    }

    var encrypt = await bcrypt.hash(password,12);

    var profileImg = req.file ? req.file.path : "";
    name = name ? name : ""

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
    res.json({feedback:true,err_msg:null})
  }).catch((err)=>{

    res.json({feedback:false,err_msg:"DB Error"})
  })

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

module.exports.GetAddPage = GetAddPage;
module.exports.GetDashboardPage = GetDashboardPage;
module.exports.CreateAccount = CreateAccount;
module.exports.GetMainPage = GetMainPage;
module.exports.GetLoginPage = GetLoginPage;
module.exports.Login = Login;
module.exports.GetCreateAccountPage = GetCreateAccountPage;
module.exports.PostExtractColor = PostExtractColor;

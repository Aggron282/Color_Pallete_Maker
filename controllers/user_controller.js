var path = require("path");
var rootDir = path.dirname(require.main.filename);
var color_util = require("./../util/colors.js");
const formidable = require('formidable');
const bcrypt = require("bcrypt")
const my_sequelize_util = require("./../util/my_sequelize.js");
const category_util = require("./../util/category_maker.js");
const {validationResult} = require("express-validator");

const DeleteUser = (req,res) =>{

  my_sequelize_util.deleteUser(req.user.user_id,(r)=>{

    if(r){
      res.json({feedback:true,msg:null});
    }
    else{
      res.json({feedback:false,msg:"Could not delete"});
    }

  });

}

const Logout = (req,res) => {
  req.user = null;
  req.session.destroy();
  res.redirect("/")
}

const EditUser = async (req,res) => {

  var {name,username,password,confirm} = req.body
  var img_file = req.file;

  var new_name = name != req.user.name ? name : req.user.name;
  var new_username = username != req.user.username ? username : req.user.username;
  var new_password = password.length > 6 ? password : req.user.password;
  var img_file = req.file ? req.file.path : null;
  var profileImg = img_file != req.user.profileImg && img_file != null ? req.file.path : req.user.profileImg;
  var encrypt = await bcrypt.hash(new_password,12);

  var config = {
    name : new_name,
    username: new_username,
    password:encrypt,
    profileImg:profileImg
  }

  my_sequelize_util.editUser(req.user.user_id,config,(data)=>{

      if(data){

        req.session.user.name = config.name;
        req.session.user.username = config.username;
        req.session.user.password = config.password;
        req.session.user.profileImg = config.profileImg;

        res.json({feedback:true,msg:"Edited User"})

      }
      else{
        res.json({feedback:false,msg:"Could not Edit"})
      }

    });

}

const Login = async (req,res) => {

    var {username,password} = req.body;

    my_sequelize_util.findUser(username,(user) => {

      if(!user){
        res.json({feedback:false,msg:"No User Found"});
        return;
      }
      else{

         bcrypt.compare(password,user.password).then((isFound)=>{

           if(!isFound){
              res.json({feedback:false,msg:"Incorrect User/Password"})
            }
            else{
              req.session.user = user;
              res.json({feedback:true,msg:null,user});
            }

        }).catch((err)=>{
          res.json({feedback:false,msg:"Crypto Error"})
        });

      }

  });

}

const CreateAccount = async (req,res) => {

  var {name,username,password} = req.body;
  console.log(name,username,password)
  var errors = validationResult(req);

  errors = errors.array();
  console.log(errors);
  if(errors.length > 0){
    console.log(errors);
    res.json({feedback:false,msg:"Validation Error", validation_errors:errors})
    return;
  }

  my_sequelize_util.findUser(username,async (found_user)=>{
    console.log(found_user);
    if(found_user.length > 0){
      res.json({feedback:false, msg: "User Already Exists"})
      return;
    }

    var encrypt = await bcrypt.hash(password,12);
    var profileImg = req.file ? req.file.path : "";

    name = name ? name : ""

    var config = {
      name:name,
      username:username,
      password:encrypt,
      profileImg:profileImg,
      email:""
    }
    console.log(config)
    my_sequelize_util.addUser(config,((new_user)=>{
      if(new_user){
        req.session.user = new_user;
      }

      if(new_user){
        res.json({feedback:true,msg:"Created Account"})
      }else{
        res.json({feedback:false,msg:"Could not Create Account"})
      }

    }));

 });

}



module.exports.EditUser = EditUser;
module.exports.DeleteUser = DeleteUser;
module.exports.CreateAccount = CreateAccount;
module.exports.Login = Login;
module.exports.Logout = Logout;

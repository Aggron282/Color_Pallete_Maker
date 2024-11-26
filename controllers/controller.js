var path = require("path");
var rootDir = path.dirname(require.main.filename);
var color_util = require("./../util/colors.js");
const formidable = require('formidable');
const bcrypt = require("bcrypt")
const mysql_util = require("./../util/mysql.js");
const category_util = require("./../util/category_maker.js");

const {validationResult} = require("express-validator");

const DeleteUser = (req,res) =>{

  mysql_util.deleteUser(req.user.user_id,(r)=>{

    if(r){
      res.json({feedback:true,err_msg:null});
    }else{
      res.json({feedback:false,err_msg:"Could not delete"});
    }

  });

}

const Logout = (req,res) => {
  req.user = null;
  req.session.destroy();
  res.redirect("/")
}

const GetMainPage = (req,res) => {
  res.render(path.join(rootDir,"views","index.ejs"));
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
    user_id:req.user.user_id,
    name : new_name,
    username: new_username,
    password:encrypt,
    profileImg:profileImg
  }

  mysql_util.editUser(config,(data)=>{

      if(data){

        req.session.user.name = config.name;
        req.session.user.username = config.username;
        req.session.user.password = config.password;
        req.session.user.profileImg = config.profileImg;

        res.json({feedback:true,err_msg:"Edited User"})
      }else{
        res.json({feedback:false,err_msg:"Could not Edit"})
      }

    });

}

const GetProfilePage = (req,res) => {
  res.render(path.join(rootDir,"views","user","profile.ejs"),{user:req.user,path:"/dashboard"});
}

const GetLoginPage = (req,res) => {
  res.render(path.join(rootDir,"views","auth","login.ejs"));
}

const GetCreateAccountPage = (req,res) => {
  res.render(path.join(rootDir,"views","auth","create_account.ejs"));
}

const GetDashboardPage = (req,res) => {

  mysql_util.findUserPallets(req.user.user_id,async (colors)=>{

    var palletes = await color_util.ConfigurePallets(colors);
    var organized_palletes = category_util.CreatePalleteCategories(palletes);
    console.log(organized_palletes)
    res.render(path.join(rootDir,"views","user","dashboard.ejs"),{user:req.user,path:"/dashboard",organized_palletes:organized_palletes});

  });

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
      }
      else{

         var user = data[0];

         bcrypt.compare(password,user.password).then((isFound)=>{

           if(!isFound){
              res.json({feedback:false,err_msg:"Incorrect User/Password"})
            }else{
              req.session.user = user;
              res.json({feedback:true,err_msg:null,user});
            }

        });

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

    if(found_user.length > 0){
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
        value:encrypt
      },
      {
        col:"profileImg",
        value:profileImg
      }
    ];

    mysql_util.InsertInto("user",data,(()=>{
      res.json({feedback:true,err_msg:null})
    }));

 });

}

const PostExtractColor = async (req,res) => {

  var img_file = req.file;

  if(img_file){
    const color_data = await color_util.ExtractColorFromImage(img_file.path);
    res.json({colors:color_data,image:img_file.path});
  }
  else{
    res.json(false);
  }

  return;

}

const GetUserPallets = async (req,res)=>{

  mysql_util.findUserPalletes(async (colors)=>{
    var palletes = await color_util.ConfigurePallets(colors);
    res.json({pallets:palletes})
  })

}

const DeletePallet =  (req,res)=> {

  var pallet_id = req.body.pallet_id;
  var user_id = req.user.user_id;

  mysql_util.deletePallet(user_id,pallet_id,(response)=>{

    if(response){
      res.json({feedback:true,err_msg:null})
    }else{
      res.json({feedback:false,err_msg:"Could not delete"})
    }

  })

}
function FromArrayToRGBList(colors){
  var rgbList = ""

  for(var i =0; i < colors.length; i++){
    var {r,g,b} = colors[i]
    if(i < colors.length - 1){
      rgbList+= `rgb(${r},${g},${b})` +  ",";
    }else{
      rgbList+= `rgb(${r},${g},${b})`;
    }
  }
  return rgbList;
}

function FromRGBListToArray(rgbList){

  var rgbListNew = []
  var rgbList = rgbList.split(",");

  for(var i =0; i < rgbList.length; i++){

    var r,g,b;
    var rgb_string = rgbList[i];
    var rgb_array = rgbToArray(rgb_string);

    r = rgb_array[0];
    g = rgb_array[1];
    b = rgb_array[2];

    rgbListNew.push({r:r,g:g,b:b});

  }

  return rgbListNew;
}

function rgbToArray(rgbString) {

  const matches = rgbString.match(/\d+/g);
  return matches.map(Number);

}

const AddPallete = async (req,res) => {

  const img_file = req.file;

  if(!img_file){
    res.json({feedback:false,err_msg:"File Empty"})
    return;
  }

  var errors = validationResult(req);

  errors = errors.array();

  const color_data = await color_util.ExtractColorFromImage(img_file.path);

  var rgbList = FromArrayToRGBList(color_data)
  var catagory = req.body.catagory  && req.body.catagory.length > 0 ? req.body.catagory : "";
  //Not needed just in case
  var name = req.body.name  && req.body.name.length > 0 ? req.body.name : "N/A";

  var data = [
      {
        col:"user_id",
        value:req.user.user_id
      },
      {
        col:"image",
        value:img_file.path
      },
      {
        col:"name",
        value:req.body.name
      },
      {
        col:"catagory",
        value:catagory
      },
      {
        col:"rgbList",
        value:rgbList
      },
      {
        col:"created_at",
        value: new Date().toISOString().slice(0, 10)
      },
      {
        col:"isViewable",
        value:false
      }
    ];

    if(errors.length > 0){
      res.json({feedback:false,err_msg:"Validation Error", validation_errors:errors})
      return;
    }

    mysql_util.InsertInto("pallete",data,((insert)=>{

      if(insert){
        res.json({feedback:true,err_msg:null})
      }
      else {
        res.json({feedback:false,err_msg:"Could not add pallet"})
      }

    }));

  }

module.exports.EditUser = EditUser;
module.exports.GetProfilePage = GetProfilePage;
module.exports.DeleteUser = DeleteUser;
module.exports.DeletePallet = DeletePallet;
module.exports.AddPallete = AddPallete;
module.exports.GetUserPallets = GetUserPallets;
module.exports.GetAddPage = GetAddPage;
module.exports.GetDashboardPage = GetDashboardPage;
module.exports.CreateAccount = CreateAccount;
module.exports.GetMainPage = GetMainPage;
module.exports.GetLoginPage = GetLoginPage;
module.exports.Login = Login;
module.exports.Logout = Logout;
module.exports.GetCreateAccountPage = GetCreateAccountPage;
module.exports.PostExtractColor = PostExtractColor;

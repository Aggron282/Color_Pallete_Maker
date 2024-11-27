var path = require("path");
var rootDir = path.dirname(require.main.filename);
var color_util = require("./../util/colors.js");
const formidable = require('formidable');
const bcrypt = require("bcrypt")
const my_sequelize_util = require("./../util/my_sequelize.js");
const category_util = require("./../util/category_maker.js");

const {validationResult} = require("express-validator");

const EditPallete = (req,res)=>{

  var {name,category,pallete_id} = req.body
  var img_file = req.file;

  my_sequelize_util.findOnePallete(req.user.user_id,pallete_id,async (found_pallete)=>{

    var new_name = name.length > 0 ? name : found_pallete.name;
    var new_category = category ? category : "";
    new_category = new_category.length ? new_category : found_pallete.category;
    var src_file = req.file ? req.file.path : found_pallete.image;

    var color_data = null;
    var rgbList = null;

    if(src_file){
     color_data = await color_util.ExtractColorFromImage(src_file);
    }
    if(color_data){
     rgbList = FromArrayToRGBList(color_data)
   }

    var config = {
      name : new_name,
      category:new_category,
      image:src_file,
      rgbList:rgbList,
    }

    my_sequelize_util.editPallete(req.user.user_id,pallete_id,config,(data)=>{

      if(data){
        res.json({feedback:true,msg:"Edited Pallete"})
      }
      else{
        res.json({feedback:false,msg:"Could not Edit"})
      }

    });

  })

}

const GetPalleteDetailPage = (req,res)=>{

  var pallete_id = req.params.pallete;

  my_sequelize_util.findOnePallete(req.user.user_id,pallete_id,async(pallete)=>{

    var pallete_ = await color_util.ConfigurePallete(pallete);

    if(pallete_){
      res.render(path.join(rootDir,"views","user","detail.ejs"),{pallete:pallete_,path:req.url,user:req.user});
    }

 });

}

const DeleteUser = (req,res) =>{

  my_sequelize_util.deleteUser(req.user.user_id,(r)=>{

    if(r){
      res.json({feedback:true,msg:null});
    }else{
      res.json({feedback:false,msg:"Could not delete"});
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

const GetAllInCategoryPage = (req,res) => {

  var category = req.params.category;

  my_sequelize_util.findUsercategoryPalletes(req.user.user_id,category,async (colors)=>{
    var all_palletes_in_category = await color_util.ConfigurePalletes(colors);
    res.render(path.join(rootDir,"views","user","all_in_category.ejs"),{category:category,user:req.user,path:req.url,all_palletes_in_category:all_palletes_in_category});
  });

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

  my_sequelize_util.findUserPalletes(req.user.user_id,async (colors)=>{

    var palletes = await color_util.ConfigurePalletes(colors);
    var organized_palletes = category_util.CreatePalleteCategories(palletes);
    res.render(path.join(rootDir,"views","user","dashboard.ejs"),{user:req.user,path:"/dashboard",organized_palletes:organized_palletes});

  });

}

const GetAddPage = (req,res) => {
  res.render(path.join(rootDir,"views","user","add.ejs"),{user:req.user,path:"/add"});
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
            }else{
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

  var errors = validationResult(req);

  errors = errors.array();

  if(errors.length > 0){
    res.json({feedback:false,msg:"Validation Error", validation_errors:errors})
    return;
  }

  my_sequelize_util.findUser(username,async (found_user)=>{

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

    my_sequelize_util.addUser(config,((result)=>{

      if(result){
        res.json({feedback:true,msg:"Created Account"})
      }else{
        res.json({feedback:false,msg:"Could not Create Account"})
      }

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

const GetUserPalletes = async (req,res)=>{

  my_sequelize_util.findUserPalletes(async (colors)=>{
    var palletes = await color_util.ConfigurePalletes(colors);
    res.json({palletes:palletes})
  })

}

const DeletePallete =  (req,res)=> {

  var pallete_id = req.body.pallete_id;
  var user_id = req.user.user_id;
  console.log(req.body)
  my_sequelize_util.deletePallete(user_id,pallete_id,(response)=>{

    if(response){
      res.json({feedback:true,msg:null})
    }
    else{
      res.json({feedback:false,msg:"Could not delete"})
    }

  })

}
function FromArrayToRGBList(colors){

  var rgbList = ""

  for(var i =0; i < colors.length; i++){

    var {r,g,b} = colors[i]

    if(i < colors.length - 1){
      rgbList+= `rgb(${r},${g},${b})` +  ",";
    }
    else{
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
    res.json({feedback:false,msg:"File Empty"})
    return;
  }

  var errors = validationResult(req);

  errors = errors.array();

  const color_data = await color_util.ExtractColorFromImage(img_file.path);

  var rgbList = FromArrayToRGBList(color_data)
  var category = req.body.category  && req.body.category.length > 0 ? req.body.category : "";
  //Not needed just in case
  var name = req.body.name  && req.body.name.length > 0 ? req.body.name : "N/A";

  var config=  {
    isViewable:false,
    name:name,
    user_id:req.user.user_id,
    image:img_file.path,
    category:category,
    rgbList:rgbList
  }

    if(errors.length > 0){
      res.json({feedback:false,msg:"Validation Error", validation_errors:errors})
      return;
    }

    my_sequelize_util.addPallete(config,((insert)=>{

      if(insert){
        res.json({feedback:true,msg:null})
      }
      else {
        res.json({feedback:false,msg:"Could not add pallete"})
      }

    }));

  }

module.exports.EditPallete = EditPallete;
module.exports.EditUser = EditUser;
module.exports.GetProfilePage = GetProfilePage;
module.exports.DeleteUser = DeleteUser;
module.exports.DeletePallete = DeletePallete;
module.exports.AddPallete = AddPallete;
module.exports.GetUserPalletes = GetUserPalletes;
module.exports.GetAddPage = GetAddPage;
module.exports.GetDashboardPage = GetDashboardPage;
module.exports.CreateAccount = CreateAccount;
module.exports.GetMainPage = GetMainPage;
module.exports.GetLoginPage = GetLoginPage;
module.exports.Login = Login;
module.exports.Logout = Logout;
module.exports.GetPalleteDetailPage = GetPalleteDetailPage;
module.exports.GetAllInCategoryPage = GetAllInCategoryPage;
module.exports.GetCreateAccountPage = GetCreateAccountPage;
module.exports.PostExtractColor = PostExtractColor;

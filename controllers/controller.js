var path = require("path");
var rootDir = path.dirname(require.main.filename);
var color_util = require("./../util/colors.js");
const formidable = require('formidable');
const bcrypt = require("bcrypt")
const my_sequelize_util = require("./../util/my_sequelize.js");
const category_util = require("./../util/category_maker.js");
const {validationResult} = require("express-validator");


const GetPalleteDetailPage = (req,res)=>{

  var pallete_id = req.params.pallete;

  my_sequelize_util.findOnePallete(req.user.user_id,pallete_id,async(pallete)=>{

    var pallete_ = await color_util.ConfigurePallete(pallete);

    if(pallete_){
      res.render(path.join(rootDir,"views","user","detail.ejs"),{pallete:pallete_,path:'/detail',user:req.user,pallete_id:pallete.pallete_id});
    }

 });

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


const GetProfilePage = (req,res) => {
  res.render(path.join(rootDir,"views","user","profile.ejs"),{user:req.user,path:"/profile"});
}

const GetLoginPage = (req,res) => {
  res.render(path.join(rootDir,"views","auth","login.ejs"));
}

const GetCreateAccountPage = (req,res) => {
  res.render(path.join(rootDir,"views","auth","create_account.ejs"));
}

const GetDashboardPage = (req,res) => {
  console.log(req.user)
  my_sequelize_util.findUserPalletes(req.user.user_id,async (colors)=>{

    var palletes = await color_util.ConfigurePalletes(colors);
    var organized_palletes = category_util.CreatePalleteCategories(palletes);

    res.render(path.join(rootDir,"views","user","dashboard.ejs"),{user:req.user,path:"/dashboard",organized_palletes:organized_palletes});

  });

}

const GetAddPage = (req,res) => {
  res.render(path.join(rootDir,"views","user","add.ejs"),{user:req.user,path:"/add",pallete:null});
}


const GetParticleMakerPage = (req,res) => {
  res.render(path.join(rootDir,"views","user","particle.ejs"),{user:req.user,path:"/particle_maker",pallete:null});
}



module.exports.GetParticleMakerPage = GetParticleMakerPage;
module.exports.GetPalleteDetailPage = GetPalleteDetailPage;
module.exports.GetAllInCategoryPage = GetAllInCategoryPage;
module.exports.GetCreateAccountPage = GetCreateAccountPage;
module.exports.GetAddPage = GetAddPage;
module.exports.GetDashboardPage = GetDashboardPage;
module.exports.GetMainPage = GetMainPage;
module.exports.GetLoginPage = GetLoginPage;
module.exports.GetProfilePage = GetProfilePage;

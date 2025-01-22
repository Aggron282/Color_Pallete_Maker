var path = require("path");
var rootDir = path.dirname(require.main.filename);
var color_util = require("./../util/colors.js");
const formidable = require('formidable');
const bcrypt = require("bcrypt")
const my_sequelize_util = require("./../util/my_sequelize.js");
const category_util = require("./../util/category_maker.js");
const {validationResult} = require("express-validator");

exports.GetMainPage = (req,res) => {
  res.render(path.join(rootDir,"views","index.ejs"));
}

exports.GetPalleteDetailPage = (req,res)=>{

  var pallete_id = req.params.pallete;

  my_sequelize_util.findOnePallete(req.user.user_id,pallete_id,async(pallete)=>{

    var pallete_ = await color_util.ConfigurePallete(pallete);

    if(pallete_){
      res.render(path.join(rootDir,"views","user","detail.ejs"),{pallete:pallete_,path:'/detail',user:req.user,pallete_id:pallete.pallete_id});
    }

 });

}

exports.GetDashboardPage = (req, res) => {
  my_sequelize_util.findUserPalletes(req.user.user_id, async (colors) => {
    const palettes = await color_util.ConfigurePalletes(colors);
    const organized_palettes = category_util.CreatePalleteCategories(palettes);
    res.render('views/user/dashboard.ejs', { user: req.user, path: "/dashboard", organized_palettes });
  });
};

exports.GetAllInCategoryPage = (req, res) => {
  const category = req.params.category;

  my_sequelize_util.findUsercategoryPalletes(req.user.user_id, category, async (colors) => {
    const all_palletes_in_category = await color_util.ConfigurePalletes(colors);
    res.render(
      path.join(rootDir, "views", "user", "all_in_category.ejs"),
      {
        category,
        user: req.user,
        path: req.url,
        all_palletes_in_category,
      }
    );
  });
};

exports.GetProfilePage = (req,res) => {
  res.render(path.join(rootDir,"views","user","profile.ejs"),{user:req.user,path:"/profile"});
}

exports.GetLoginPage = (req,res) => {
  res.render(path.join(rootDir,"views","auth","login.ejs"));
}

exports.GetCreateAccountPage = (req,res) => {
  res.render(path.join(rootDir,"views","auth","create_account.ejs"));
}

exports.GetDashboardPage = (req,res) => {

  my_sequelize_util.findUserPalletes(req.user.user_id,async (colors)=>{

    var palletes = await color_util.ConfigurePalletes(colors);
    var organized_palletes = category_util.CreatePalleteCategories(palletes);

    res.render(path.join(rootDir,"views","user","dashboard.ejs"),{user:req.user,path:"/dashboard",organized_palletes:organized_palletes});

  });

}

exports.GetAddPage = (req,res) => {
  res.render(path.join(rootDir,"views","user","add.ejs"),{user:req.user,path:"/add",pallete:null});
}

exports.GetProfilePage = (req, res) => {
  res.render('views/user/profile.ejs', { user: req.user, path: "/profile" });
};

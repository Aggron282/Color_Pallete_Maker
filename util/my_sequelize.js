var sequelize = require("sequelize");
var Sequelize = require("./../util/sequelize_connection.js");
var Pallete = require("./../models/color_pallete.js")
var User = require("./../models/user.js");
var mysql = require("mysql2");
var color_util = require("./colors.js");

async function findOnePallete(user_id, pallete_id, cb) {
    try {
        const pallete = await Pallete.findOne({
            where: { pallete_id, user_id }
        });

        cb(pallete ? pallete.dataValues : false);
    } catch (error) {
        console.error("Error finding pallete:", error);
        cb(false);
    }
}


async function findPalletesByArraySearch(user_id, terms, cb) {
    if (!terms || terms.length === 0) {
        return [];
    }

    let found_palletes = [];

    await Promise.all(terms.map(async (term) => {
        let rgb = color_util.hexToRgb(term);
        let search_term = rgb ? rgb : term;

        if (color_util.isRGB(search_term)) {
            // Search by RGB
            let search_by_rgb = await Pallete.findAll({ where: { user_id } });

            search_by_rgb.forEach((pallete) => {
                let rgb_arr = pallete.rgbList.split(" ");
                if (rgb_arr.includes(search_term.trim())) {
                    found_palletes.push(pallete);
                }
            });

        } else if (term) {
            // Search by category
            let search_by_category = await Pallete.findAll({
                where: {
                    user_id,
                    category: term.toLowerCase().trim()
                }
            });

            found_palletes.push(...search_by_category);

            // Search by name
            let search_by_name = await Pallete.findAll({
                where: {
                    user_id,
                    name: term.toLowerCase().trim()
                }
            });

            found_palletes.push(...search_by_name.map(p => p.dataValues));
        }
    }));

    cb(found_palletes);
}

async function editPallete(user_id,pallete_id,config,cb){

  const new_pallete = await Pallete.update(
    config,
    {
      where: {
        user_id: user_id,
        pallete_id:pallete_id
      }
    }
  );

  if(new_pallete){
    cb(true)
  }
  else{
    cb(false);
  }

}

async function editUser(user_id,config,cb){

  const edit_user_exec = await User.update(
    config,
    {
      where: {
        user_id: user_id
      }
    }
  );

  if(edit_user_exec){
    cb(true);
  }
  else{
    cb(false)
  }

}

async function findUser(username,cb){

  const user = await User.findOne({
    where: {
      username: username,
    }
  });

  if(user){
    cb(user);
  }
  else{
    cb(false)
  }

}

async function deletePallete(user_id, pallete_id, cb) {
    try {
        const delete_exec = await Pallete.destroy({ where: { user_id, pallete_id } });
        cb(delete_exec > 0);
    } catch (error) {
        console.error("Error deleting pallete:", error);
        cb(false);
    }
}

async function deleteUser(user_id, cb) {
    try {
        const delete_exec = await User.destroy({ where: { user_id } });
        cb(delete_exec > 0);
    } catch (error) {
        console.error("Error deleting user:", error);
        cb(false);
    }
}

async function findUserPalletes(user_id,cb){

  const user_palletes = await Pallete.findAll({
    where: {
      user_id: user_id,
    }
  });

  if(user_palletes){

    var pallete_list = [];

    for(var i =0; i < user_palletes.length;i++){
      var p = user_palletes[i].dataValues;
      pallete_list.push(p);
    }

    cb(pallete_list);

  }else{
    cb(false)
  }

}

async function findUserCategoryPalletes(user_id,category,cb){

  const user_category_palletes = await Pallete.findAll({
    where: {
      user_id: user_id,
      category:category
    }
  });

  if(user_category_palletes){
    cb(user_category_palletes);
  }
  else{
    cb(false)
  }

}

async function addUser(config,cb){
  console.log(config);
  const new_user = await User.create(config);

  if(new_user){
    cb(new_user);
  }
  else{
    cb(false);
  }

}

async function addPallete(config,cb){

  const new_pallete = await Pallete.create(config);

  if(new_pallete){
    cb(true);
  }
  else{
    cb(false);
  }

}

module.exports.addUser = addUser;
module.exports.addPallete = addPallete;
module.exports.editPallete = editPallete;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;
module.exports.deletePallete = deletePallete;
module.exports.findUser = findUser;
module.exports.findPalletesByArraySearch = findPalletesByArraySearch
module.exports.findOnePallete = findOnePallete;
module.exports.findUserPalletes = findUserPalletes;
module.exports.findUserCategoryPalletes = findUserCategoryPalletes;

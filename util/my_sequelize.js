var sequelize = require("sequelize");
var Sequelize = require("./../util/sequelize_connection.js");
var Pallete = require("./../models/color_pallete.js")
var User = require("./../models/user.js");
var mysql = require("mysql2");

async function findOnePallete(user_id,pallete_id,cb){

  const pallete = await Pallete.findOne({
    where: {
      pallete_id: pallete_id,
      user_id:user_id
    }
  });

  if(pallete){
    cb(pallete.dataValues);
  }
  else{
    cb(false)
  }

}

async function findPalletesByArraySearch(user_id,terms,cb){

  var found_palletes = [];

  for(var i =0; i < terms.length; i++){
   
    var rgb = null
   
    rgb = color_util.hexToRgb(terms[i]);
   
    var search_term = rgb ? rgb : terms[i];

    if(color_util.isRGB(search_term)){

      var search_by_rgb = await Pallete.findAll(  {
         
        where: {
            user_id: user_id,
          }

        }

      );

      for(var z =0 ; z < search_by_rgb.length;z++){

        var rgb_arr = search_by_rgb[z].rgbList.split(" ");
        
        for(var x = 0; x < rgb_arr.length; x++){
          
          if(rgb_arr[x] === search_term.trim()){
            found_palletes.push(search_by_rgb[z])
            break;
          }

        }

      }
    }
    else if(terms[i]){

      var search_by_category = await Pallete.findAll(  {
          where: {
            user_id: user_id,
            category:terms[i].toLowerCase().trim()
          }
        }

        );

        for(var i = 0; i < search_by_category.length; i++){
            found_palletes.push(search_by_category[i])
        }

        if(!terms[i]){
          break;
        }
       
        var search_by_name = await Pallete.findAll({
            where: {
              user_id: user_id,
              name:terms[i].toLowerCase().trim()
            }
          }
        );

        for(var i = 0; i < search_by_name.length; i++){
          found_palletes.push(search_by_name[i].dataValues)
        }

      }

    }

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

async function deletePallete(user_id,pallete_id,cb){

  const delete_exec = await Pallete.destroy({
    where: {
      user_id: user_id,
      pallete_id:pallete_id
    }
  });

  if(delete_exec){
    cb(true)
  }
  else{
    cb(false)
  }

}

async function deleteUser(user_id,cb){

  const delete_exec = await User.destroy({
    where: {
      user_id: user_id,
    }
  });

  if(delete_exec){
    cb(true)
  }
  else{
    cb(false)
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

  const new_user = await User.create(config);

  if(new_user){
    cb(true);
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

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
module.exports.findOnePallete = findOnePallete;
module.exports.findUserPalletes = findUserPalletes;
module.exports.findUserCategoryPalletes = findUserCategoryPalletes;

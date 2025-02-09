var path = require("path");
var rootDir = path.dirname(require.main.filename);
var color_util = require("./../util/colors.js");
const formidable = require('formidable');
const bcrypt = require("bcrypt")
const my_sequelize_util = require("./../util/my_sequelize.js");
const category_util = require("./../util/category_maker.js");
const {validationResult} = require("express-validator");
var ai_util = require("./../util/ai.js");

const GetRecommendedPallete = async (req,res)=>{
  var color = req.body.color;
  var type = req.body.type;
  var message = `Give me an array of 4-8 colors that are similar ${type} with this ${color} color, only provide the array`;

  try{
    var answer = await ai_util.AIMessage(message);
    res.status(200).json({message:answer});
   }
  catch{
    res.status(500).json({message:false,error:"Error with ChatGTP"});
  }

}

const ConvertColor = (req,res) => {

  var color = req.body.color;
  var type = req.body.type;
  var original_type = color_util.detectColorFormat(color);
  var convert = null
  console.log(type)
  if(type == original_type){
     res.json({color:color,original_color:color});
     return;
  }

  if(original_type == "hex"){

    if(type == "hsl"){
      convert = color_util.ConvertFromHexToHSL(color);
    }
    if(type == "rgb"){
      convert = color_util.ConvertFromHexToRGB(color);
    }

  }

  if(original_type == "rgb"){

    if(type == "hex"){
      convert = color_util.ConvertFromRGBToHex(color);
    }
    console.log(convert)

    if(type == "hsl"){
      convert = color_util.ConvertFromRGBToHSL(color);
    }

  }

  if(original_type == "hsl"){

    if(type == "hex"){
      convert = color_util.ConvertFromHSLToHex(color);
    }

    if(type == "rgb"){
      convert = color_util.ConvertFromHSLToRGB(color);
    }

  }

  return res.json({color:convert,original_color:color});

}


const ConvertFilter = (req,res) => {

  var color = req.body.color;
  var filter = color_util.ConfigureFilter(color)

  return res.json({filter:filter});

}


const PostExtractColor = async (req,res) => {

  var img_file = req.file;
  console.log(img_file);
  if(img_file){
    const color_data = await color_util.ExtractColorFromImage(img_file.path);
    console.log(color_data)
    res.json({colors:color_data,image:img_file.path});
  }
  else{
    res.json({error:"img data is null"});
  }

  return;

}

const GetComplementaryColors = async (req,res)=>{

  var pallete_id = req.body.pallete_id;
  var isCustom = req.body.isCustom;

  my_sequelize_util.findOnePallete(req.user.user_id,pallete_id,async (pallete)=>{
    var new_colors = await color_util.GetColor(pallete,1,isCustom);
    res.json({new_colors:new_colors})
  })

}

const GetPrimaryColors = (req,res)=>{

  var pallete_id = req.body.pallete_id;
  var isCustom = req.body.isCustom;

  my_sequelize_util.findOnePallete(req.user.user_id,pallete_id,async (pallete)=>{

    var new_colors = await color_util.GetColor(pallete,2,isCustom);
    res.json({new_colors:new_colors})

  })

}

const GetTriadColors = (req,res)=>{

  var pallete_id = req.body.pallete_id;
  var isCustom = req.body.isCustom;

  my_sequelize_util.findOnePallete(req.user.user_id,pallete_id,async (pallete)=>{

    var new_colors = await color_util.GetColor(pallete,1,isCustom);
    res.json({new_colors:new_colors})

  })

}

const GetOriginalColors = (req,res)=>{

  var pallete_id = req.body.pallete_id;
  var isCustom = req.body.isCustom;

  my_sequelize_util.findOnePallete(req.user.user_id,pallete_id,async (pallete)=>{
    var new_colors = await color_util.GetColor(pallete,0,isCustom);
    res.json({new_colors:new_colors})
  })

}


module.exports.GetRecommendedPallete = GetRecommendedPallete;
module.exports.ConvertFilter = ConvertFilter;
module.exports.ConvertColor = ConvertColor;
module.exports.PostExtractColor = PostExtractColor;
module.exports.GetOriginalColors = GetOriginalColors;
module.exports.GetComplementaryColors = GetComplementaryColors;
module.exports.GetTriadColors = GetTriadColors;
module.exports.GetPrimaryColors = GetPrimaryColors;

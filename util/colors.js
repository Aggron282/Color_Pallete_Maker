const getColors = require('get-image-colors')
var compColors = require('complementary-colors');

const ExtractColorFromImage = async (src) => {

   const colors = await getColors(src);

   var rgba = colors.map((color)=>{

     var rgb = {
        r: color._rgb[0],
        g: color._rgb[1],
        b: color._rgb[2]
      }

      return rgb;

    });

    return rgba

}

function configureRGB(str){

  const regex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const match = str.match(regex);

  if (!match){
    return false
  }
  else{

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    if( r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255){
      return {r:r,g:g,b:b};
    }
    else{
      return false;
    }

  }

}

const ConfigureColors = async (colors,type) =>{

  var new_colors = [];

  if(type <=0){
    return colors;
  }

  for(var i =0; i < colors.length ; i ++){

    var con_color = configureRGB(colors[i]);
    var r,g,b;

    if(con_color){
      r = con_color.r
      g = con_color.g
      b = con_color.b
    }
    else{
      return [];
    }

    var hex = rgbToHex(r,g,b);
    var myColor = new compColors(hex);
    var color_ = null

    if(type == 2){
       color_ = myColor.primary();
    }
    else if(type == 1){
       color_ = myColor.complementary();
    }
    else if (type == 3) {
       color_ = myColor.triad();
    }

    if(color_){

      if(color_[1]){

        var {r,g,b} = color_[1];

        color_ = `rgb(${r},${g},${b})`

        new_colors.push(color_);

      }

    }

  }

  return new_colors;

}

function hexToRgb(hex) {

  if (!/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex)) {
      return;
  }

  if (hex.length === 4) {
      hex = "#" + [...hex.slice(1)].map(x => x + x).join("");
  }

  const bigint = parseInt(hex.slice(1), 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgb(${r},${g},${b})`;

}

const GetComplementaryColors = async (colors)=>{
  var new_colors = await ConfigureColors(colors,1)
  return new_colors;
}

const GetTriadColors = async (colors)=>{
  var new_colors = await ConfigureColors(colors,3)
  return new_colors;
}

const GetOriginalColors = async (colors)=>{
  var new_colors = await ConfigureColors(colors,0)
  return new_colors;
}

const GetPrimaryColors = async (colors)=>{
  var new_colors = await ConfigureColors(colors,2)
  return new_colors;
}

function componentToHex  (c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex  (r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const ConfigurePallete = async (pallete) =>{

  if(!pallete){
    return null;
  }

  var colors = await ExtractColorFromImage(pallete.image);
  var new_data = {...pallete}

  new_data.colors = colors;

  return new_data;

}

const ConfigurePalletes = async (palletes) => {

  var new_palletes = [];

  for(var i =0; i < palletes.length; i++){
    var new_data = await ConfigurePallete(palletes[i]);
    new_palletes.push(new_data);
  }

  return new_palletes;

}

function isRGB(str) {
  const regex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const match = str.match(regex);

  if (!match){
    return false
  }
  else{

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;

  }

}

module.exports.ConfigurePallete  = ConfigurePallete;
module.exports.GetComplementaryColors  = GetComplementaryColors;
module.exports.GetTriadColors  = GetTriadColors;
module.exports.GetPrimaryColors  = GetPrimaryColors;
module.exports.GetOriginalColors =  GetOriginalColors;
module.exports.ConfigurePalletes  = ConfigurePalletes;
module.exports.ExtractColorFromImage  = ExtractColorFromImage;
module.exports.hexToRgb = hexToRgb;
module.exports.isRGB = isRGB;

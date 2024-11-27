const getColors = require('get-image-colors')

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


module.exports.ConfigurePallete  = ConfigurePallete;

module.exports.ConfigurePalletes  = ConfigurePalletes;
module.exports.ExtractColorFromImage  = ExtractColorFromImage;

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

const ConfigurePallets = async (pallets) => {

  var new_pallets = [];

  for(var i =0; i < pallets.length; i++){

    var colors = await ExtractColorFromImage(pallets[i].image);
    var new_data = {...pallets[i]}

    new_data.colors = colors;
    new_pallets.push(new_data);

  }

  return new_pallets;

}



module.exports.ConfigurePallets  = ConfigurePallets;
module.exports.ExtractColorFromImage  = ExtractColorFromImage;

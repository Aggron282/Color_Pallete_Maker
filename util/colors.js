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



module.exports.ExtractColorFromImage  = ExtractColorFromImage;

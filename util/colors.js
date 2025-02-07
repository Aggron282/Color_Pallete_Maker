const getColors = require('get-image-colors')
var compColors = require('complementary-colors');

const ColorType = {
  HEX: "hex",
  RGB: "rgb",
  HSL: "hsl",
  UNKNOWN: null
};


function detectColorFormat(color) {
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)) {
        return "hex"; // Matches #FFF, #FFFFFF
    } else if (/^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i.test(color)) {
        return "rgb"; // Matches rgb(255, 255, 255)
    } else if (/^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/i.test(color)) {
        return "hsl"; // Matches hsl(360, 100%, 50%)
    } else {
        return "unknown"; // If it doesn't match any format
    }
}


async function GetColor(pallete,type,isCustom){

  var colors = [];

   new_colors = null;

   if(isCustom){

     if(!pallete.customRGBList){
       return []
     }
     else if(pallete.customRGBList.length <=0){
       return [];
     }

     colors = pallete.customRGBList.split(" ");

   }
   else{

     if(!pallete.rgbList){
       return []
     }
     else if(pallete.rgbList.length <=0){
       return [];
     }

     colors = pallete.rgbList.split(" ");

   }

   if(colors.length <= 0){
     return new_colors;
   }
   else{

     if(type == 1){
       new_colors = await GetComplementaryColors(colors);

     }
     else if (type <= 0){
       new_colors = await GetOriginalColors(colors);

     }
     else if(type == 2){
       new_colors = await GetPrimaryColors(colors);

     }
     else if(type == 3){
       new_colors = await GetTriadColors(colors);

     }
     else{
       new_colors = await GetOriginalColors(colors);

     }

     return new_colors;

   }

}

function detectColorType(colorString) {

  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorString)) {
    return ColorType.HEX;
  }
  else if (/^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/.test(colorString)) {
    return ColorType.RGB;
  }
  else if (/^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/.test(colorString)) {
    return ColorType.RGBA;
  }
  else if (/^hsl\(\s*\d{1,3}\s*,\s*(\d{1,3}%|\d{1,3})\s*,\s*(\d{1,3}%|\d{1,3})\s*\)$/.test(colorString)) {
    return ColorType.HSL;
  }
  else if (/^hsla\(\s*\d{1,3}\s*,\s*(\d{1,3}%|\d{1,3})\s*,\s*(\d{1,3}%|\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/.test(colorString)) {
    return ColorType.HSLA;
  }
  else {
    return ColorType.UNKNOWN;
  }

}

function componentToHex  (c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex  (r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function rgbToHsl(r, g, b) {
    // Normalize RGB values to the range [0, 1]
    r /= 255;
    g /= 255;
    b /= 255;

    // Find min and max values for lightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l;

    // Calculate lightness
    l = (max + min) / 2;

    // Calculate saturation
    if (max === min) {
        s = 0; // No saturation for greyscale
    } else {
        const delta = max - min;
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    }

    // Calculate hue
    if (max === min) {
        h = 0; // No hue for greyscale
    } else if (max === r) {
        h = ((g - b) / (max - min) + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
        h = ((b - r) / (max - min) + 2) * 60;
    } else if (max === b) {
        h = ((r - g) / (max - min) + 4) * 60;
    }

    h = Math.round(h);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

function rgbToHsl(r, g, b) {
    // Normalize RGB values to the range [0, 1]
    r /= 255;
    g /= 255;
    b /= 255;

    // Find min and max values for lightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l;

    // Calculate lightness
    l = (max + min) / 2;

    // Calculate saturation
    if (max === min) {
        s = 0; // No saturation for greyscale
    } else {
        const delta = max - min;
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    }

    // Calculate hue
    if (max === min) {
        h = 0; // No hue for greyscale
    } else if (max === r) {
        h = ((g - b) / (max - min) + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
        h = ((b - r) / (max - min) + 2) * 60;
    } else if (max === b) {
        h = ((r - g) / (max - min) + 4) * 60;
    }

    h = Math.round(h);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

function hexToHsl(hex) {
    // Remove the hash if present
    hex = hex.replace(/^#/, '');

    // Parse RGB values
    let r = parseInt(hex.slice(0, 2), 16) / 255;
    let g = parseInt(hex.slice(2, 4), 16) / 255;
    let b = parseInt(hex.slice(4, 6), 16) / 255;

    // Find min and max values for lightness
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l;

    // Calculate lightness
    l = (max + min) / 2;

    // Calculate saturation
    if (max === min) {
        s = 0; // No saturation for greyscale
    } else {
        let delta = max - min;
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    }

    // Calculate hue
    if (max === min) {
        h = 0; // No hue for greyscale
    } else if (max === r) {
        h = ((g - b) / (max - min) + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
        h = ((b - r) / (max - min) + 2) * 60;
    } else if (max === b) {
        h = ((r - g) / (max - min) + 4) * 60;
    }

    h = Math.round(h);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s; // Chroma
    const x = c * (1 - Math.abs((h / 60) % 2 - 1)); // Intermediate value
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
        r = c; g = 0; b = x;
    }

    // Convert to 0–255 range
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    // Convert to hexadecimal
    const toHex = (val) => val.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s; // Chroma
  const x = c * (1 - Math.abs((h / 60) % 2 - 1)); // Intermediate value
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
  }

  // Convert to [0, 255] range
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `rgb(${r}, ${g}, ${b})`;
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

function turnHSLStringIntoObject(hsl){
    const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i;
    const match = hsl.match(hslRegex);

    if (match) {
        const h = parseInt(match[1], 10); // Hue
        const s = parseInt(match[2], 10); // Saturation
        const l = parseInt(match[3], 10); // Lightness
        return { h, s, l };
    }
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

const ExtractColorFromImage = async (src) => {

   const colors = await getColors(src,{count:10});

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

const ConfigurePallete = async (pallete) =>{

  if(!pallete){
    return null;
  }
  if(pallete.image){
    var colors = await ExtractColorFromImage(pallete.image);
    var new_data = {...pallete}
    new_data.colors = FromArrayToRGBList(colors)
    console.log(new_data)
  }else if(pallete.customRGBList != null){
    var new_data = {...pallete};
  }

  return new_data;

}

 function FromArrayToRGBList(colorArray) {
  console.log(colorArray)
    return colorArray
        .map(color => `rgb(${color.r},${color.g},${color.b})`)
        .join(' ');
}


const ConfigurePalletes = async (palletes) => {

  var new_palletes = [];

  for(var i =0; i < palletes.length; i++){
    var new_data = await ConfigurePallete(palletes[i]);
    new_palletes.push(new_data);
  }

  return new_palletes;

}


const ConvertFromRGBToHSL = (original)=>{
  var {r,g,b} = configureRGB(original);
  return rgbToHsl(r,g,b);
}

const ConvertFromRGBToHex = (original) => {
  var {r,g,b} = configureRGB(original);
  return rgbToHex(r,g,b);
}

const ConvertFromHexToHSL = (original)=>{
  return hexToHsl(original);
}

const ConvertFromHexToRGB = (original)=>{
  return hexToRgb(original);
}

const ConvertFromHSLToRGB = (original)=>{
  var {h,s,l} = turnHSLStringIntoObject(original);
  var rgb = rgbToHsl(h,s,l);
  return rgb;
}

const ConvertFromHSLToHex = (original)=>{
    var {h,s,l} = turnHSLStringIntoObject(original);
    var hex = hslToHex();
    return hex;
}

const ConfigureFilter = (original) => {

   var type = detectColorType(original);
   var hex_new = original;
   console.log(type,original)
   if(type){

     if(type == "hex"){
       hex_new = original;
     }
     else if(type == "hsl"){
       hex_new = ConvertFromHSLToHex(original);
     }
     else {
       hex_new = ConvertFromRGBToHex(original);
     }

   }
   else{
     return null;
   }

   console.log(hex_new);

   var filter = hexToFilter(hex_new);
   return filter;
}

function hexToFilter(hex) {

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const brightness = (r + g + b) / (3 * 255) * 100;
    const contrast = 100;
    const sepia = 0;
    const hueRotate = 0;
    const invert = 0;
    console.log(contrast,sepia,hueRotate)
    return `brightness(0) brightness(${brightness}%) contrast(${contrast}%) sepia(${sepia}%) hue-rotate(${hueRotate}deg) invert(${invert}%)`;

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
module.exports.detectColorFormat = detectColorFormat;
module.exports.ConfigureFilter = ConfigureFilter;
module.exports.ConvertFromHSLToHex = ConvertFromHSLToHex;
module.exports.ConvertFromHSLToRGB = ConvertFromHSLToRGB;
module.exports.GetColor =GetColor;
module.exports.ConvertFromHexToRGB = ConvertFromHexToRGB;
module.exports.ConvertFromHexToHSL = ConvertFromHexToHSL;
module.exports.FromArrayToRGBList = FromArrayToRGBList;
module.exports.ConvertFromRGBToHSL = ConvertFromRGBToHSL;
module.exports.ConvertFromRGBToHex = ConvertFromRGBToHex;

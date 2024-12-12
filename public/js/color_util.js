function componentToHex  (c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex  (r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

async function GetPrimaryColors(pallete_id,isCustom){
  return await GetColors(pallete_id, "/colors/primary",isCustom);
}

async function GetOriginalColors(pallete_id,isCustom){
  return  GetColors(pallete_id, "/colors/original",isCustom);
}

async function GetColors(pallete_id, url,isCustom){

  var {data} = await axios.post(url,{pallete_id:pallete_id,isCustom:isCustom});
  
  if(data){ 
     
      if(data.new_colors){
       return data.new_colors
      }
      else {
        return false
      }

  }
  else{
    return false
  }

}

async function GetComplementaryColors(pallete_id,isCustom){
  return await GetColors(pallete_id, "/colors/complementary",isCustom);
}

async function GetTriadColors(pallete_id,isCustom){
  return await GetColors(pallete_id, "/colors/triad",isCustom);
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
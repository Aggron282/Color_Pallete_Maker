const ReturnPalleteHTML=(color)=>{
  var {r,g,b} = color
  var rgb = `rgba(${r},${g},${b})`

  return(
    `
    <div class="color_blob" style="background:${rgb}">${rgb}</div>
    `)

}

function RenderImg(src,container){
  var img_element = `<img src = ${src} class="display_img" />`;
  container.innerHTML = img_element;
}

function RenderGradientOrImage(isImage,src,pure_colors,container) {
  if (isImage) {RenderImg(src, container)}
  else {RenderGradient(pure_colors, container)}
}


function RenderGradient(colors,container){

  if(!colors){return;}

  if(colors.length == 1){
    var gradient = `<div class="img_display" style="background:${colors[0]}"></div>`;
    container.innerHTML = gradient;
    return;
  }
  else{

  var line = "linear-gradient(to bottom,";

  for(var i =0; i < colors.length; i++){

    line+= colors[i];

    if(i < colors.length - 1){
      line+=","
    }

  }

    line+=")";

    var gradient = `<div class="img_display" style="background:${line}"></div>`;

    container.innerHTML = gradient;
  }

}


const ReturnHexPalleteHTML=(hex)=>{

  return(
    `
    <div class="color_blob" style="background:${hex}">${hex}</div>
    `)

}

const RenderPallete = (container,colors) => {

    if(!container || !colors){
      return;
    }
    else{
      var html = ``

      for(var i =0; i < colors.length; i++){
        html += ReturnPalleteHTML(colors[i]);
      }

      container.innerHTML = html;

  }

}

const RenderHexPallete = (container,colors) => {

    var html = ``

    for(var i =0; i < colors.length; i++){
      html += ReturnHexPalleteHTML(colors[i]);
    }

    container.innerHTML = html;

}


const RenderDisplayImg = (container,src) => {
  var html = `<img src =${src} class="img_display" />`
  container.innerHTML = html;
}

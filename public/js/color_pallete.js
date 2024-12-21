const ReturnPalleteHTML=(color)=>{
  var {r,g,b} = color
  var rgb = `rgba(${r},${g},${b})`

  return(
    `
    <div class="color_blob" style="background:${rgb}">${rgb}</div>
    `)

}

const ReturnHexPalleteHTML=(hex)=>{

  return(
    `
    <div class="color_blob" style="background:${hex}">${hex}</div>
    `)

}

const RenderPallete = (container,colors) => {

    var html = ``

    for(var i =0; i < colors.length; i++){
      html += ReturnPalleteHTML(colors[i]);
    }

    container.innerHTML = html;

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

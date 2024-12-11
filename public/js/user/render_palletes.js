var search_colors_form = document.querySelector(".search_colors_form");
var result_container = document.querySelector(".result_container");
var palletes_organized_container = document.querySelector(".all_container");

function componentToHex  (c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex  (r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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

function RenderColorPalleteCircles(pallete,container,color_detail_container){

  var html = ``;

  var colors = pallete.rgbList.split(" ");

  for(var x =0; x < colors.length; x ++) {

    var {r,g,b} = configureRGB(colors[x]);

    var hex = rgbToHex(r,g,b);

    container.innerHTML += `

    <div class="color--i">

      <div class="color_box" color = ${colors[x]} style="background:${colors[x]}">

        <div class="color_detail">
          <p class="title"> ${colors[x]} |  ${hex} </p>
        </div>

      </div>

    </div>`

  }

}

function RenderPalletes(palletes){

  for(var i = 0; i < palletes.length; i++) {

    result_container.innerHTML += ReturnPalleteBoxHTML(palletes[i],null)

     var element = result_container.querySelector(`[_id="${palletes[i].pallete_id}"]`);

     var pallete_circle_container = element.querySelector(".color_container");
     var pallete_bar_container = element.querySelector(".color_bar_container");
     var color_detail_container = element.querySelector(".color_detail_container");

     RenderColorPalleteCircles(palletes[i],pallete_circle_container,color_detail_container);

  }

}

function ReturnPalleteBoxHTML(pallete,x){

  var src_name = pallete.image;
  var src = src_name.substring(src_name.lastIndexOf('\\') + 1);
  console.log(x)
  var style_ = x != null ? `left:${x}%` : "float:left;position:relative";
  var style_choice = x != null ? "choices" : "choices choices--search";
  console.log(style_choice)
  return(
    `
    <div class="pallete_card" _id = "${ pallete.pallete_id }" style="${style_}" >

        <div class="menu"_id = "${ pallete.pallete_id }">
          <img src = "./imgs/set.png" _id = "${ pallete.pallete_id }"/>
        </div>

        <div class="${style_choice}" isActive = "0"  _id = "${ pallete.pallete_id }">

          <div class="menu_in_choice"_id = "${ pallete.pallete_id }">
            <img src = "./imgs/set.png" _id = "${ pallete.pallete_id }"/>
          </div>

          <span class="pallete_choice pallete_choice--active">Overview</span>
          <span class="pallete_choice"><a href ="/pallete/${pallete.pallete_id}">See Details</a></span>
          <span class="pallete_choice">Complimentary Colors</span>

          <span class="pallete_choice pallete_choice--delete" pallete_id = "${pallete.pallete_id}">Delete</span>

        </div>

        <div class="exit" _id = "${ pallete.pallete_id }" >
            X
        </div>

        <p class="pallete_title"> ${ pallete.name }</p>

        <div class="img_holder"><img src = "${src}"/></div>
        <div class="color_container"></div>
        <div class="color_detail_container"></div>

    </div>
    `
  )
}

function MenuPallete(){

    document.addEventListener('click', function(e) {

      if (e.target.closest('.menu_in_choice')) {
          var id = e.target.getAttribute("_id");
          var choice_container = document.querySelector(`.choices[_id="${id}"]`);
          choice_container.classList.remove("choices--active")
      }else if(e.target.closest('.menu')){
          var id = e.target.getAttribute("_id");
          var choice_container = document.querySelector(`.choices[_id="${id}"]`);
          choice_container.classList.add("choices--active")
      }
      if (e.target.closest('.pallete_choice--delete')) {
          Delete(e.target.getAttribute("pallete_id"),"/dashboard");
      }


  });

}

function RenderPalletesInCategory(category,container){

  var x = category.counter * incr_x;
  var y = 0;
  var html = `<div class='inner_category' id="category-scroll">`;

  for(var z = 0; z < category.palletes.length; z ++) {

    var pallete = category.palletes[z];

    if(!pallete){
      break;
    }

    var src_name = pallete.image;
    var src = src_name.substring(src_name.lastIndexOf('\\') + 1);

    container.innerHTML += ReturnPalleteBoxHTML(pallete,x);

    x += incr_x

    var element = container.querySelector(`[_id="${pallete.pallete_id}"]`);

    var pallete_circle_container = element.querySelector(".color_container");

    var pallete_bar_container = element.querySelector(".color_bar_container");

    var color_detail_container = element.querySelector(".color_detail_container");

    RenderColorPalleteCircles(pallete,pallete_circle_container,color_detail_container);

  }

  container.innerHTML += "</div>"

  MenuPallete();

}

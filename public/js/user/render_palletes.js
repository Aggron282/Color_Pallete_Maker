var search_colors_form = document.querySelector(".search_colors_form");
var result_container = document.querySelector(".result_container");
var palletes_organized_container = document.querySelector(".all_container");

function RenderColorPalleteCircles(colors,container){

  var html = ``;

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
     var colors = palletes[i].rgbList.split(" ");

     RenderColorPalleteCircles(colors,pallete_circle_container);

  }

}

function ReturnPalleteBoxHTML(pallete,x){

  var src_name = pallete.image;
  var src = src_name.substring(src_name.lastIndexOf('\\') + 1);

  var style_ = x != null ? `left:${x}%` : "float:left;position:relative";
  var style_choice = x != null ? "choices" : "choices choices--search";

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

          <span class="pallete_choice pallete_choice--active pallete_choice--original"pallete_id = "${pallete.pallete_id}">Original Colors</span>
          <span class="pallete_choice"><a href ="/pallete/${pallete.pallete_id}">See Details</a></span>
          <span class="pallete_choice pallete_choice--complementary" pallete_id = "${pallete.pallete_id}">Complementary Colors</span>

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

async function MenuPallete(){

    document.addEventListener('click', async function(e) {

      if (e.target.closest('.menu_in_choice')) {
          var id = e.target.getAttribute("_id");
          var choice_container = document.querySelector(`.choices[_id="${id}"]`);
          choice_container.classList.remove("choices--active")
      }
      else if(e.target.closest('.menu')){
          var id = e.target.getAttribute("_id");
          var choice_container = document.querySelector(`.choices[_id="${id}"]`);
          choice_container.classList.add("choices--active")
      }
      else if (e.target.closest('.pallete_choice--delete')) {
          Delete(e.target.getAttribute("pallete_id"),"/dashboard");
      }
      else if (e.target.closest('.pallete_choice--original')) {
          ToggleColorPalleteMenu(0,e);
      }
      else if (e.target.closest('.pallete_choice--complementary')) {
          ToggleColorPalleteMenu(1,e);
      }

  });

}

async function ToggleColorPalleteMenu(type,e){

  var pallete_id = e.target.getAttribute("pallete_id")
  var new_colors = [];

  if(type <= 0){
    new_colors =  await GetOriginalColors(pallete_id);
  }
  else if (type == 1){
    new_colors =  await GetComplementaryColors(pallete_id);
  }

  var choice_container = document.querySelector(`.choices[_id="${e.target.getAttribute("pallete_id")}"]`);

  SetPalleteMenuActive(e.target.parentElement.parentElement,e.target);
  ExtractThenRenderColorCircles(new_colors,pallete_id);

  choice_container.classList.remove("choices--active")

}

function SetPalleteMenuActive(container,active_choice){

  var pallete_choices = container.querySelectorAll(".pallete_choice");

  for(var i =0; i < pallete_choices.length; i++){
      pallete_choices[i].classList.remove("pallete_choice--active");
    }

  active_choice.classList.add('pallete_choice--active');

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
    var colors = pallete.rgbList.split(" ");

    RenderColorPalleteCircles(colors,pallete_circle_container);

  }

  container.innerHTML += "</div>"

  MenuPallete();

}

function ExtractThenRenderColorCircles(new_colors,id){

  var element = document.querySelector(`.pallete_card[_id="${id}"]`);
  var pallete_circle_container = element.querySelector(".color_container");

  pallete_circle_container.innerHTML = "";

  RenderColorPalleteCircles(new_colors,pallete_circle_container);

}

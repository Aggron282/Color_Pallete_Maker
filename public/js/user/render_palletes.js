var search_colors_form = document.querySelector(".search_colors_form");
var result_container = document.querySelector(".result_container");
var palletes_organized_container = document.querySelector(".all_container");

function RenderColorPalleteCircles(colors,container){

  var html = ``;
  container.innerHTML = "";
  console.log(colors);
  var limit = colors.length > 5 ? 5 : colors.length;
  for(var x =0; x < limit; x ++) {

    if(colors[x].length > 0){
      var color = colors[x];
      var {r,g,b} = configureRGB(color);

      var hex = rgbToHex(r,g,b);

      container.innerHTML += `

      <div class="color--i">

        <div class="color_box" color = ${color} style="background:${color}">

          <div class="color_detail">
            <p class="title"> ${color} |  ${hex} </p>
          </div>

        </div>

      </div>`
    }

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
  var src = null;
  try{
     src = src_name.substring(src_name.lastIndexOf('\\') + 1);
  }
  catch{
    src = "";
  }

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
          <span class="pallete_choice pallete_choice--pure" data-display = "0" pallete_id = "${pallete.pallete_id}">See Custom Colors</span>
          <span class="pallete_choice"><a href ="/detail/${pallete.pallete_id}">See Details</a></span>
          <span class="pallete_choice pallete_choice--complementary" pallete_id = "${pallete.pallete_id}">Complementary Colors</span>
          <span class="pallete_choice pallete_choice--delete" pallete_id = "${pallete.pallete_id}">Delete</span>

        </div>

        <div class="exit" _id = "${ pallete.pallete_id }" >
            X
        </div>

        <p class="pallete_title"> ${ pallete.name }</p>

        <div class="img_holder content-holder">

        </div>
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
      else if (e.target.closest('.pallete_choice--pure')) {
          var isImage;
          var display = e.target.dataset.display;
          if(display == "0"){
            isImage = false;
            display = "1";
          }else{
            isImage = true;
            display = "0";
          }

          e.target.setAttribute("data-display",display)

          TogglePureAndExtractedDisplay(isImage,e);

      }

  });

}

async function TogglePureAndExtractedDisplay(isImage,e){

  var pallete_id = e.target.getAttribute("pallete_id");

  var {data} = await axios.post("/user/pallete/single/",{pallete_id:pallete_id});
  data = data.pallete;

  if(!data.customRGBList || !data.image){
    alert("You only have one type of color pallete here");
    return;
  }

  if(data.customRGBList.length <=0 || data.image.length <=0){
    alert("You only have one type of color pallete here");
    return;
  }

  var new_colors = [];

  var pallete_el = document.querySelector(`.pallete_card[_id="${pallete_id}"]`);
  var holder_container = pallete_el.querySelector(".content-holder");
  var pallete_circle_container = pallete_el.querySelector(".color_container");
  var choice_container = document.querySelector(`.choices[_id="${e.target.getAttribute("pallete_id")}"]`);
  var src = data.image;

  if(src){
    src = src.substring(src.lastIndexOf('\\') + 1);
  }else{
    src = "";
  }

  if(isImage){
    new_colors = data.rgbList.split(" ");
  }
  else{
    new_colors = data.customRGBList.split(" ");
  }

  RenderGradientOrImage(isImage,src,new_colors,holder_container);

  choice_container.classList.remove("choices--active")

  RenderColorPalleteCircles(new_colors,pallete_circle_container);

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
    var src_name = pallete.image;
    var src = null;
    var colors =[];
    var isImage = false;


    if(!pallete){
      break;
    }
    console.log(pallete)
    container.innerHTML += ReturnPalleteBoxHTML(pallete,x);

    var element = container.querySelector(`[_id="${pallete.pallete_id}"]`);
    var pallete_circle_container = element.querySelector(".color_container");
    var img_display_container = element.querySelector(".content-holder");

    if(pallete.customRGBList != null){

      try{
        colors = pallete.customRGBList.split(" ");
        isImage = false;
      }
      catch{
        colors = [];
      }

    }
    if(src_name){

      try{
        src = src_name.substring(src_name.lastIndexOf('\\') + 1);
        isImage = true;
        colors = pallete.rgbList.split(" ");
      }
      catch{
        isImage = false;
      }

    }
    else{
      isImage = false;
    }

    RenderColorPalleteCircles(colors,pallete_circle_container);
    RenderGradientOrImage(isImage,src,colors,img_display_container);

    x += incr_x

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

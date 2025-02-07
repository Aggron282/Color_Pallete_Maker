var type_converter_container = document.querySelector(".type_converter_container");
var form_converter = document.querySelector(".convert--form");
var type_to_convert = document.querySelector(".type_conversion");
var type_form = "color";
var form_button_converter =  document.querySelector(".submit-button--converter");
var color_boxess = type_converter_container.querySelectorAll("*");
var type_value = "";

form_converter.addEventListener("submit",(e)=>{
  e.preventDefault();
  SubmitConversion(e);
});

form_button_converter.addEventListener("submit",(e)=>{
  e.preventDefault();
  SubmitConversion(e);
});

async function Recommend(type, color ){

  var type_ = "go well"
  if(type == "comp"){
    type_ = "are complementary and go well"
  }
  else if(type == "tri"){
    type_ = "are triad and go well"
  }
  else if(type == "rec"){
    type_ = "that match and go well"
  }

  var {data} = await axios.post("/ai/recommend",{type:type_,color:color});
  return data.message;
}

async function SubmitConversion(e){

    var root = "/convert/";
    var form = new FormData(form_converter);
    var {data} = await axios.post(root+type_form,form);
    var converted_color = data.color;
    PopulateConversion(converted_color)
    var comp = await Recommend("comp",converted_color);
    var tri = await Recommend("tri",converted_color);
    var rec = await Recommend("rec",converted_color);
    var color_grid = document.querySelector(".color-grid");
    var color_grid_tri = document.querySelector(".color-grid--tri");
    var color_grid_comp = document.querySelector(".color-grid--comp");

    RenderColorPallete(color_grid,rec);
    RenderColorPallete(color_grid_tri,tri);
    RenderColorPallete(color_grid_comp,comp);

}

color_boxess.forEach(function (box) {

  box.addEventListener("click", function (e) {

    e.stopPropagation();
    console.log(e.target.dataset.type)

    if(!e.target.dataset.type){
      return alert("");
    }

    var type = e.target.dataset.type.toString().toLowerCase();

    TurnOffActiveColorType();

    e.target.classList.add("type-box--active");

    if(type == "rgb" || type == "hsl" || type == "hex"){
      type_form = "color";
    }
    else{
      type_form = "filter";
    }

    type_to_convert.value = type;

  });

});

function PopulateConversion(converted_color){

  var circle_color = document.querySelector(".circle-color");
  var color_grid = document.querySelector(".color-grid");
  var color_answer_main = document.querySelector(".color-answer--main");

  circle_color.style.background = converted_color;
  color_answer_main.innerHTML = converted_color;

}

function RenderColorPallete(grid,palletes){

  grid.innerHTML = "";
  for(var o =0; o < palletes.length; o++){

    var pallete = palletes[o];
    grid.innerHTML += ReturnColorElement(pallete);
  }

}

function ReturnColorElement(color){

  return `
  <div class="color-answer" style="background:${color}">
    ${color}
  </div>
  `

}

function TurnOffActiveColorType(){

  color_boxess.forEach(function (box) {
    box.classList.remove("type-box--active");
  });

}

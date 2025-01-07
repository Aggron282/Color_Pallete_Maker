const ColorType = {
  HEX: "hex",
  RGB: "rgb",
  HSL: "hsl",
  UNKNOWN: null
};

var color_input = document.querySelector(".color_input");
var submit_color = document.querySelector(".submit_color");
var select_convert_to = document.querySelector(".select_convert_to");
var color_form = document.querySelector(".rgb_form");
var color_picker_input = document.querySelector(".color_picker_input");

var filter_input = document.querySelector(".filter_input");
var filter_form = document.querySelector(".filter_form");

var filter_button = document.querySelector(".submit_filter");
var filter_picker = document.querySelector(".filter_picker");

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


function TurnHexToRGB(from,color,to){

  if(!from || !color || !to){
    alert("Invalid Input");
    return;
  }

  var container = document.querySelector(".color_result_container");
  console.log(to,from);
  axios.post(`/colors/convert`,{color:color,type:to,original_type:from}).then(({data})=>{


    var html = `
      <p class="result-text">${data.color}</p>
      `;

    container.innerHTML = html;
    color_picker_input.value = color;

  });

}

function figureConversionType(type){

   Object.entries(ColorType).forEach(([key, value]) => {

    if(type == value){
      return value;
    }

  });

}

function SubmitAndConvertColor(e){

  e.preventDefault();

  var value = color_input.value.trim();

  var convert_to_type  = select_convert_to.value.toLowerCase();

  var from = detectColorType(value);

  TurnHexToRGB(from,value,convert_to_type)

}

function SubmitAndConvertColor(e){

  e.preventDefault();

  var value = filter_input.value.trim();

  TurnToFilter(value)

}

function TurnToFilter(color){
  console.log(color)
  if(!color){
    alert("Invalid Input");
    return;
  }

  var container = document.querySelector(".filter_result_container");

  axios.post(`/colors/convert_filter`,{color:color}).then(({data})=>{
    if(!data.filter){
      alert("Invalid Input");
      return;
    }
    console.log(data.filter)
    var html = `
      <p class="result-text">${data.filter}</p>
      `;

    container.innerHTML = html;
    filter_picker.value = color;

  });

}

submit_color.addEventListener("click",(e)=>{
  SubmitAndConvertColor(e);
});

color_form.addEventListener("submit",(e)=>{
  SubmitAndConvertColor(e);
});


filter_button.addEventListener("click",(e)=>{
  SubmitAndConvertColor(e);
});

filter_form.addEventListener("submit",(e)=>{
  SubmitAndConvertColor(e);
});

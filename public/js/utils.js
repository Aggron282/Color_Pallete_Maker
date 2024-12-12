function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

const  CreateFormData = (form_element)=>{

  const formData = new FormData(form_element);

  var data = {};

  for (const [key, value] of formData) {
    data[key] = value;
  }

  return data;

}

const  CreateArrayData = (form_element)=>{

  const formData = new FormData(form_element);

  var data = [];

  for (const [key, value] of formData) {
    data.push(value);
  }

  return data;

}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

async function CreatePopup (message,type){

  var container = document.querySelector(".popup_container");
  var type = type ? "popup--"+type : "";

  var html = `
  <div class="popup ${type}">
    ${message}
  </div>
  `
  container.innerHTML = html;

  var remove_class = "popup--remove";

  await Delay(4000);

  var popup = document.querySelector(".popup");

  popup.classList.add(remove_class);

}

function ExtractFormData(form){
  var new_form = new FormData(form);

  var data = {};

  for([key,value] in new_form){
    console.log(key,value);
    data[key] = value;
  }

  return form;

}

async function Delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

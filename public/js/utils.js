function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const setInnerHTML = (container, content) => {
    if (container) container.innerHTML = content;
};

function getLastUrlSegment() {
    const url = window.location.href;
    const trimmedUrl = url.replace(/\/$/, "");
    const segments = trimmedUrl.split("/");
    return segments.pop();
}

function toFormData(data) {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
            // Append array values individually
            data[key].forEach(value => formData.append(`${key}[]`, value));
        } else if (data[key] instanceof File) {
            // Handle File objects
            formData.append(key, data[key]);
        } else if (typeof data[key] === 'object' && data[key] !== null) {
            // Convert objects to JSON strings
            formData.append(key, JSON.stringify(data[key]));
        } else {
            formData.append(key, data[key]);
        }
    });

    return formData;
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
    data[key] = value;
  }

  return form;

}

async function Delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

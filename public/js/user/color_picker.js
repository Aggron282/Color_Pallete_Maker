const add_picker = document.querySelector("#add_picker");
const picker_submit = document.querySelector(".picker_submit");
const picker_form = document.querySelector("#picker_form");
const picker_container = document.querySelector(".content_container");
const picker_modal = document.querySelector(".color_picker_container");
const picker_wrapper = document.querySelector(".color_picker_wrapper");
const picker_modal_btn = document.querySelector(".detail_btn--add");
const picker_exit = document.querySelector("#picker_exit");
const custom_color_container = document.querySelector(".custom_rgb_detail_container");

let counter = 1;

function createColorPickerElement(name, color = null, counter = null) {

    const wrapper = document.createElement("div");
    const deleteBtn = document.createElement("p");

    wrapper.className = "relative c-box";

    deleteBtn.className = "delete--color";
    deleteBtn.setAttribute("_id", `color_${counter !== null ? counter : name}`);
    deleteBtn.textContent = "X";

    deleteBtn.addEventListener("click", function(e) {

        const parent = deleteBtn.parentElement;
        console.log("s")
        if (parent) {
            parent.remove();
        }

    });

    const input = document.createElement("input");

    input.className = "picker_input";
    input.name = `color_${counter !== null ? counter : name}`;
    input.type = "color";

    if (color) input.value = color;

    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(input);

    return wrapper;
}



function TogglePickerModal(isOn) {
  picker_wrapper.classList.toggle("color_picker_wrapper--active", isOn);
  picker_modal.classList.toggle("color_picker_container--active", isOn);
}

add_picker.addEventListener("click", () => {
  const newPicker = createColorPickerElement(counter++);
  picker_container.appendChild(newPicker);
});

function RenderPickerInputs(colors){

  var html = "";

  picker_container.innerHTML = ""

  for(var i = 0; i < colors.length; i++){
    html += createColorPickerElement(colors[i],i)
  }

  picker_container.innerHTML = html;

}

picker_exit.addEventListener("click", (e) =>{
  e.preventDefault();
  TogglePickerModal(false);
});

picker_modal_btn.addEventListener("click", (e) => {
  e.preventDefault();
  TogglePickerModal(true);
});

picker_form.addEventListener("submit", (e) => {

  e.preventDefault();

  const colors = Array.from(picker_form.querySelectorAll(".picker_input")).map((input) => input.value);

  RenderCustomColors(colors);
  UpdateGradientImage(colors);
  TogglePickerModal(false);

});


picker_submit.addEventListener("click",async (e)=>{

  e.preventDefault();

  var container = document.querySelector(".custom_rgb_detail_container");
  var colors = CreateArrayData(picker_form);

  TogglePickerModal(false);

  localStorage.setItem("pure_config", JSON.stringify(colors));

  RenderColorPallete(container,colors);


});

function RenderCustomColors(colors) {

  custom_color_container.innerHTML = "";

  colors.forEach((color) => {

    const colorDiv = document.createElement("div");

    colorDiv.className = "custom_color";
    colorDiv.style.backgroundColor = color;
    custom_color_container.appendChild(colorDiv);

  });

}

function UpdateGradientImage(colors) {

  if (typeof RenderGradient === "function") {
    RenderGradient(colors, img_display_continer);
  }

}

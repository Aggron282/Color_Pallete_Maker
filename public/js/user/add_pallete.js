let isImage = false;

function InitDisplay(pure_colors,extracted_colors,img_container,custom_color_container,extract_color_container){

  if (pure_colors) {

    RenderGradient(pure_colors, img_container);
    RenderPickerInputs(pure_colors)
    RenderColorPallete(custom_color_container, pure_colors)

    isImage = false;

  }

  if (extracted_colors) {

    if (extracted_colors.colors){
      RenderColorPallete(extract_color_container, extracted_colors.colors);
    }
    if (extracted_colors.src) {
      RenderImg(extracted_colors.src, img_container);
      isImage = true;
    }
    else if (pure_colors) {
      RenderGradient(extracted_colors, img_container);
      isImage = false;
    }

  }

}

async function SubmitImageInEditor(button,container,form,img_container){

  if (button.getAttribute("ison") != "1") return;

  const response = await SubmitUpload(form, container,img_container);

  const pure_colors = JSON.parse(localStorage.getItem("pure_config"));

  localStorage.setItem("config", JSON.stringify(response));
  
}

function ToggleDisplay(container){

  const extracted_colors = JSON.parse(localStorage.getItem("config"));
  const pure_colors = JSON.parse(localStorage.getItem("pure_config"));

  if (!extracted_colors || !pure_colors) return;

  if (pure_colors.length > 0 && extracted_colors.colors.length > 0) {
    isImage = !isImage;
    RenderGradientOrImage(isImage,extracted_colors.src,pure_colors,container);
  }

}

async function SaveNewPallete(form){

  const new_form = new FormData(form);
  const extracted_colors = JSON.parse(localStorage.getItem("config"));
  const pure_colors = JSON.parse(localStorage.getItem("pure_config"));

  if(extracted_colors){
    if (extracted_colors.src) new_form.set("image", extracted_colors.src);
  }

  if (pure_colors) new_form.set("colors", pure_colors);

  const { data } = await axios.post("/save", new_form);

  if (data.feedback) {

    CreatePopup("Created Image", "success");

    localStorage.clear();

    await Delay(500);

    window.location.assign("/dashboard");

  }else {
    CreatePopup(data.msg, "alert");
    RenderValidationErrors(data.validation_errors);
  }

}

function ActivateButtons(save_btn,upload_btn){

  const extracted_colors = JSON.parse(localStorage.getItem("config"));

  if(extracted_colors){

    if(extracted_colors.src){
      upload_btn.classList.add("add_pallete_button--active");
      save_btn.classList.add("save_pallete_button--active");
      save_btn.setAttribute("ison",1);
      upload_btn.setAttribute("ison",1);
    }

  }

}

async function InitPalleteEditor() {

  isImage = true;

  var img_upload_button = null;

  const extracted_colors = JSON.parse(localStorage.getItem("config"));
  const pure_colors = JSON.parse(localStorage.getItem("pure_config"));

  var img_upload_input = document.querySelector("#pallete-image-input");
  var img_upload_form = document.querySelector("#add-pallete-user");

  var upload_button = document.querySelector(".add_pallete_button");
  var save_pallete_button = document.querySelector(".save_pallete_button");

  const convert_icon = document.querySelector(".convert_icon");

  const img_display_container = document.querySelector(".render_container_display")
  const extract_display_container = document.querySelector(".extract_display_container");
  const custom_display_container = document.querySelector(".custom_display_container");

  const renderContainer = document.querySelector(".render_container_display");

  InitDisplay(pure_colors,extracted_colors,img_display_container,custom_display_container,extract_display_container);

  ActivateButtons(save_pallete_button,upload_button);

  if (img_upload_input) {

    img_upload_input.addEventListener("change", () => {
      InstantImageUpload(img_upload_input, img_display_container);
      upload_button.classList.add("add_pallete_button--active");
      upload_button.setAttribute("isOn","1");
    });

  }

  if (upload_button) {

    upload_button.addEventListener("click", async (e) => {
      e.preventDefault();
      SubmitImageInEditor(upload_button,extract_display_container,img_upload_form,img_display_container);
      ActivateButtons(save_pallete_button,upload_button);
    });

  }

  save_pallete_button.addEventListener("click", async () => {

    if (save_pallete_button.getAttribute("ison") != "1") {
      CreatePopup("You must extract an image!", "alert");
      return;
    }

    SaveNewPallete(img_upload_form);

  });

  if (convert_icon) {

    convert_icon.addEventListener("click", () => {
      ToggleDisplay(img_display_container);
    });

  }

}

InitPalleteEditor();

// localStorage.clear();
const retrieved_config = JSON.parse(localStorage.getItem("config"));
const retrieved_pure_config = JSON.parse(localStorage.getItem("pure_config"));

const convert_icon = document.querySelector(".convert_icon");
const img_display_container = document.querySelector(".render_container_display")

let isImage = true;

function InitPalleteEditor() {

  const container = document.querySelector(".extract_display_container");
  const renderContainer = document.querySelector(".render_container_display");
  const customDisplayContainer = document.querySelector(".custom_display_container");
  if (retrieved_pure_config) {
    RenderGradient(retrieved_pure_config, img_display_container);
    RenderPickerInputs(retrieved_pure_config)
    RenderHexPallete(customDisplayContainer, retrieved_pure_config)
    isImage = false;
  }

  if (retrieved_config) {

    if (retrieved_config.colors){
      RenderPallete(container, retrieved_config.colors);
    }
    if (retrieved_config.src) {
      RenderImg(retrieved_config.src, img_display_container);
      upload_button.classList.add("add_pallete_button--active");
      isImage = true;
    }
    else if (retrieved_pure_config) {
      RenderGradient(retrieved_pure_config, img_display_container);
      isImage = false;
    }

  }

  ChangeSaveStatus(retrieved_config, retrieved_pure_config);

}

function ChangeSaveStatus(config, colors) {
  const action = config || colors ? "add" : "remove";
  save_pallete_button.classList[action]("save_pallete_button--active");
}

if (img_upload_input) {

  img_upload_input.addEventListener("change", () => {
    InstantImageUpload(img_upload_input, img_display_container);
    upload_button.classList.add("add_pallete_button--active");
  });

}

if (upload_button) {

  upload_button.addEventListener("click", async (e) => {

    e.preventDefault();

    if (!upload_button.classList.contains("add_pallete_button--active")) return;

    const container = document.querySelector(".extract_display_container");
    const config = await SubmitUpload(img_upload_form, container);

    localStorage.setItem("config", JSON.stringify(config));
    localStorage.setItem("pure_config", JSON.stringify(retrieved_pure_config));

    ChangeSaveStatus(config, retrieved_pure_config);

  });

}

save_pallete_button.addEventListener("click", async () => {

  if (!save_pallete_button.classList.contains("save_pallete_button--active")) {
    CreatePopup("You must extract an image!", "alert");
    return;
  }

  const new_form = new FormData(img_upload_form);
  if(retrieved_config){
    if (retrieved_config.src) new_form.set("image", retrieved_config.src);
  }
  if (retrieved_pure_config) new_form.set("colors", retrieved_pure_config);

  const { data } = await axios.post("/save", new_form);

  if (data.feedback) {
    CreatePopup("Created Image", "success");
    localStorage.clear();
    await Delay(500);
    window.location.assign("/dashboard");
  }
  else {
    CreatePopup(data.msg, "alert");
    RenderValidationErrors(data.validation_errors);
  }

});

if (convert_icon) {

  convert_icon.addEventListener("click", () => {

    if (!retrieved_pure_config || !retrieved_config) return;

    if (retrieved_pure_config.length > 0 && retrieved_config.colors.length > 0) {
      isImage = !isImage;
      RenderGradientOrImage(isImage,retrieved_config.src,retrieved_pure_config,img_display_container);
    }

  });

}

InitPalleteEditor();

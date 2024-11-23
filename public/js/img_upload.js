const DisplayExtractionResults  = ({colors,image}) => {

  var root_img = image.split('images\\')[1];
  var src = "/"+root_img;

  RenderDisplayImg(img_display_continer,src)
  RenderPallete(color_pallete_container,colors)

}

const InstantImageUpload = (input,display) => {

    let [file] = input.files

    const reader = new FileReader();

    reader.onload = (e) => {
      var img_element = `<img src = ${e.target.result} class="display_img" />`;
      display.innerHTML = img_element;
      CreatePopup("Uploaded Image")
      return e;
    };

    reader.onerror = (err) => {
        console.error("Error reading file:", err);
        CreatePopup("Error occured in reading file","error")
    };

    reader.readAsDataURL(file);

}

const SubmitUpload = async (form) => {

  var new_form = new FormData(form);

  const {data} = await axios.post("/extract",new_form);

  if(!data){
    CreatePopup("Could not extract","error")
    return false;
  }

  CreatePopup("Extracted","success")
  DisplayExtractionResults(data)

  return true;

}

if(img_upload_form){

  img_upload_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    SubmitUpload(img_upload_form);
  })

  if(img_upload_button){
    img_upload_button.addEventListener("submit",(e)=>{
      e.preventDefault();
      SubmitUpload(img_upload_form);
    })
  }

}

const RenderDisplayImg = (container,src) => {
  var html = `<img src =${src} class="img_display" />`
  container.innerHTML = html;
}

function InitImageUploadFeature(img_upload_form, img_upload_button, extraction_grid,image_container) {
    console.log(img_upload_form, img_upload_button, extraction_grid)
    if (img_upload_form && img_upload_button && extraction_grid && image_container) {
      InitImageUpload(img_upload_form, img_upload_button, extraction_grid,image_container);
    }
}

const DisplayExtractionResults  = ({colors,image},grid,img_container) => {
  console.log(grid,img_container)
  if(!image || !colors){
    return null;
  }

  var root_img = image.split('images\\')[1];
  var src = "/"+root_img;

  RenderDisplayImg(img_container,src)
  console.log(colors)
  var colors_string = colors.map((color)=>{
    return TurnRGBObjectToString(color);
  });

  var config = {src:src,colors:colors};
  console.log(grid,colors_string);
  RenderColorPallete(grid,colors_string);

  if(root_img){
    return config;
  }
  else{
    return null;
  }

}

const InstantImageUpload = (input,display) => {

    let [file] = input.files

    const reader = new FileReader();

    reader.onload = (e) => {
      RenderDisplayImg(display,e.target.result)
      CreatePopup("Uploaded Image")
      return e;
    };

    reader.onerror = (err) => {
        console.error("Error reading file:", err);
        CreatePopup("Error occured in reading file","error")
    };

    reader.readAsDataURL(file);

}


const SubmitUpload = async (form,container,img_container) => {
  console.log(form)
  var new_form = new FormData(form);
  console.log(new_form)
  try{

    const {data} = await axios.post("/extract",new_form);
    console.log(data)
    if(data.error){
      CreatePopup("Could not extract","error")
      return false;
    }

    CreatePopup("Extracted","success")

    var src = DisplayExtractionResults(data,container,img_container)
    console.log(src)
    return src;

  }
  catch(error){
    console.error(error);
    CreatePopup("Could not extract","error")
    return false;
  }



}

function InitImageUpload(form,button,grid,img_container){
  console.log(form,button,grid,img_container)
  if(form){

    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      SubmitUpload(form,grid,img_container);
    })

    if(button){

      button.addEventListener("submit",(e)=>{
        e.preventDefault();
        SubmitUpload(form,grid,img_container);
      })

    }

  }

}

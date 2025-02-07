
const RenderDisplayImg = (container,src) => {
  var html = `<img src =${src} class="img_display" />`
  container.innerHTML = html;
}

function TurnRGBObjectToString({r,g,b}){
    return `rgb(${r},${g},${b})`
}

const DisplayExtractionResults  = ({colors,image},container) => {

  if(!image || !colors){
    return null;
  }

  var root_img = image.split('images\\')[1];
  var src = "/"+root_img;

  RenderDisplayImg(img_display_continer,src)
  var colors_string = colors.map((color)=>{
    return TurnRGBObjectToString(color);
  });

  var grid = document.querySelector(".extraction-grid");
  var config = {src:src,colors:colors};

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


const SubmitUpload = async (form,container) => {

  var new_form = new FormData(form);

  try{
    const {data} = await axios.post("/extract",new_form);

    if(!data){
      CreatePopup("Could not extract","error")
      return false;
    }

    CreatePopup("Extracted","success")
    var src = DisplayExtractionResults(data,container)

    return src;
  }catch{
    CreatePopup("Could not extract","error")
    return false;
  }



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

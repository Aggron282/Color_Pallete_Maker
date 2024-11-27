var pallete_edit_form = document.querySelector("#edit-pallete");
var pallete_image_upload_input = document.querySelector(".pallete_input--file");
var pallete_img_container = document.querySelector(".edit_img_container");
var pallete_edit_button = document.querySelector("#pallete-edit-btn");


pallete_image_upload_input.addEventListener("change",(e)=>{

  InstantImageUpload(pallete_image_upload_input,pallete_img_container);

})


pallete_edit_form.addEventListener("submit",async(e)=>{
  e.preventDefault();
  SubmitEdit()
});

pallete_edit_button.addEventListener("click",async(e)=>{
  e.preventDefault();
  SubmitEdit()
});


async function SubmitEdit(){

  var new_form = new FormData(pallete_edit_form);

  const {data} = await axios.post("/pallete/edit",new_form);

  if(data.feedback){
    CreatePopup(data.msg,"success");
    await Delay(1000);
    window.location.assign("/dashboard");
  }else if(data.msg){
    CreatePopup(data.msg,"error");
  }

}

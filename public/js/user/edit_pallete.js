var pallete_edit_form = document.querySelector("#edit-pallete");
var pallete_image_upload_input = document.querySelector(".pallete_input--file");
var pallete_img_container = document.querySelector(".edit_img_container");
var pallete_edit_button = document.querySelector("#pallete-edit-btn");
var pallete_toggle_edit = document.querySelector(".edit_pallete_btn");
var pallete_toggle_display = document.querySelector(".display_pallete_btn");
var edit_container = document.querySelector(".edit_container");
var display_container = document.querySelector(".detail_container");

var isEditing = false;

pallete_image_upload_input.addEventListener("change",(e)=>{

  InstantImageUpload(pallete_image_upload_input,pallete_img_container);

});


pallete_edit_form.addEventListener("submit",async(e)=>{
  e.preventDefault();
  SubmitEdit()
});

pallete_edit_button.addEventListener("click",async(e)=>{
  e.preventDefault();
  SubmitEdit()
});

pallete_toggle_edit.addEventListener("click",async(e)=>{
  ToggleDisplays(true);
});

pallete_toggle_display.addEventListener("click",async(e)=>{
  ToggleDisplays(false);
});


function ToggleDisplays(isEditingOn){

  if(isEditingOn){
    edit_container.classList.add("edit_container--active");
    display_container.classList.remove("detail_container--active");
  }else{
    edit_container.classList.remove("edit_container--active");
    display_container.classList.add("detail_container--active");
  }

}

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


ToggleDisplays(false)

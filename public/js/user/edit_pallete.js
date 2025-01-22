var pallete_edit_form = document.querySelector("#edit-pallete");
var pallete_image_upload_input = document.querySelector(".pallete_input--file");
var pallete_img_container = document.querySelector(".edit_img_container");
var pallete_edit_button = document.querySelector("#pallete-edit-btn");
var pallete_toggle_edit = document.querySelector(".edit_pallete_btn");
var pallete_toggle_display = document.querySelector(".display_pallete_btn");
var edit_container = document.querySelector(".edit_container");
var display_container = document.querySelector(".detail_container");
var original_btn = document.querySelector(".detail_btn--original");
var complementary_btn = document.querySelector(".detail_btn--complementary");
var flame= "🔥";
var color_list_container =document.querySelector(".c--container");
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
    color_list_container.classList.remove("c--container--active");
  }
  else{
    edit_container.classList.remove("edit_container--active");
    display_container.classList.add("detail_container--active");
    color_list_container.classList.add("c--container--active");

  }

}

async function SubmitEdit(){

  var new_form = new FormData(pallete_edit_form);

  const {data} = await axios.post("/user/pallete/edit",new_form);

  if(data.feedback){

    CreatePopup(data.msg,"success");

    await Delay(1000);

    window.location.assign("/dashboard");

  }
  else if(data.msg){
    CreatePopup(data.msg,"error");
  }

}

function HighlightDetailMenuChoice(e){

    var detail_btns= document.querySelectorAll(".detail_btn");

    for(var i =0; i < detail_btns.length;i++){
      if(e){
        detail_btns[i].classList.remove("detail_btn--active")
      }else if(!detail_btns[i].classList.contains("detail_btn--active")){
        detail_btns[i].classList.remove("detail_btn--active")
      }
    }
    if(e){
      e.target.classList.add("detail_btn--active");
    }

}

async function RenderColorsToDetail(type,isCustom){

  var class_ = isCustom ? "custom_rgb_detail_container" : "rgb_detail_container";
  var container = document.querySelector("."+class_);

  container.innerHTML = ``;

  var pallete_id = document.querySelector(".edit_container").getAttribute("pallete_id");
  var new_colors = [];

  if(type <= 0){
     new_colors = await GetOriginalColors(pallete_id,isCustom);
  }
  else{
    new_colors = await GetComplementaryColors(pallete_id,isCustom);
  }

  RenderColorPalleteCircles(new_colors,container);

}

original_btn.addEventListener("click",(e)=>{
  RenderColorsToDetail(0,false);
  RenderColorsToDetail(0,true)
  HighlightDetailMenuChoice(e);
})

complementary_btn.addEventListener("click",(e)=>{
  RenderColorsToDetail(1,false);
  RenderColorsToDetail(1,true);
  HighlightDetailMenuChoice(e);
})

ToggleDisplays(false);
RenderColorsToDetail(0,false);
RenderColorsToDetail(0,true)

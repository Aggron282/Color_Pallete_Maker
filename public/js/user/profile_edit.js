var profile_edit_form = document.querySelector("#profile-edit-form");
var profile_image_upload_input = document.querySelector(".profile_input--file");
var profile_img_container = document.querySelector(".profile_img_container");
var profile_edit_button = document.querySelector("#profile-edit-btn");

profile_image_upload_input.addEventListener("change",(e)=>{

  InstantImageUpload(profile_image_upload_input,profile_img_container);

})


profile_edit_form.addEventListener("submit",async(e)=>{
  e.preventDefault();
  SubmitEdit()
});

profile_edit_button.addEventListener("click",async(e)=>{
  e.preventDefault();
  SubmitEdit()
});


async function SubmitEdit(){

  var new_form = new FormData(profile_edit_form);

  const {data} = await axios.post("/profile/edit",new_form);

  if(data.feedback){
    CreatePopup("Edited User","success");
    await Delay(1000);
    window.location.assign("/dashboard");
  }
  else if(data.msg){
    CreatePopup(data.msg,"error");
  }

}

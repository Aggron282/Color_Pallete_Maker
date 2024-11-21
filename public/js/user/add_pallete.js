
if(img_upload_input){

  img_upload_input.addEventListener("change",async (e)=>{

    InstantImageUpload(img_upload_input,img_display_continer);
    upload_button.classList.add("add_pallete_button--active")

  });

}


if(upload_button){

    upload_button.addEventListener("click",async (e)=>{

      e.preventDefault();

      if(upload_button.classList.contains("add_pallete_button--active")){
         extraction  = await SubmitUpload(img_upload_form);
         if(extraction){
            save_pallete_button.classList.add("save_pallete_button--active");
         }else{
             save_pallete_button.classList.remove("save_pallete_button--active");
         }
      }

    })

}

save_pallete_button.addEventListener("click",(e)=>{

  if(save_pallete_button.classList.contains("save_pallete_button--active")){
      console.log("Save Results")
  }else{
    console.log("Must Extract");
  }

})

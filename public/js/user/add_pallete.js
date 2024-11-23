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

save_pallete_button.addEventListener("click",async (e)=>{

  if(save_pallete_button.classList.contains("save_pallete_button--active")){

      var new_form = new FormData(img_upload_form);
      const {data} = await axios.post("/save",new_form);
      CreatePopup("Created Image","success");
  }else{
    CreatePopup("You must extract image!","alert");
  }

})

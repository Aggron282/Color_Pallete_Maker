var delete_account = document.querySelector(".profile_choice_container--delete_account")

delete_account.addEventListener("click",async(e)=>{

  var delete_prompt = prompt("Type DELETE to delete user (Cannot undo this action)");

  if(delete_prompt.replaceAll(" ","") == "DELETE"){

    const {data} = await axios.post("/delete/user/perm");

    if(data.feedback){
      window.location.assign("/")
    }else{
      CreatePopup(data.err_msg,"alert");
    }

  }

})

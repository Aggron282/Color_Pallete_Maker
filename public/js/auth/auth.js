var create_account_btn = document.querySelector(".auth_button--create")
var create_account_form = document.querySelector(".auth_form--create")

var login_btn = document.querySelector(".auth_button--login")
var login_form = document.querySelector(".auth_form--login")

async function SubmitNewAccount(e){

  e.preventDefault()

  var {msg,feedback} =  await SubmitAccount(create_account_form,"/create_account","/create_account")

  if(!feedback){
    ActivateRings("ring--wrong")
  }
  
  CreatePopup(msg,"normal");

}

async function SubmitLogin(e){

  e.preventDefault()

  var {msg,feedback} =  await SubmitAccount(login_form,"/login","/login")

  if(!feedback){
    ActivateRings("ring--wrong")
    CreatePopup(msg,"normal");
  }

}

if(create_account_form){

  create_account_form.addEventListener("submit",async (e)=>{
    SubmitNewAccount(e);
  });

  create_account_btn.addEventListener("click",async (e)=>{
    SubmitNewAccount(e);
  });

}

if(login_form){

  login_form.addEventListener("submit",async (e)=>{
    SubmitLogin(e);
  });

  login_btn.addEventListener("click",async (e)=>{
    SubmitLogin(e);
  });

}

async function SubmitAccount(form,url,redirect){

  var new_form = new FormData(form);
  const {data} = await axios.post(url,new_form);

  var error_containers = document.querySelectorAll(".error_container")

  for(var w =0; w < error_containers.length; w++){
    error_containers[w].innerHTML = "";
  }

  if(data.validation_errors){

    if(data.validation_errors){
      RenderValidationErrors(data.validation_errors)
    }

  }
  else if(data.feedback){

    GrantAccessRings(async (response)=>{
      await Delay(1000);
      window.location.assign("/dashboard");
    });

  }
  else{
    var errors = ["username / password incorrect","username / password incorrect"]
    RenderValidationErrors(errors);
  }

  return {
    msg:data.msg,
    feedback:data.feedback
  }

}

function RenderValidationErrors(errors){

  var inputs = document.querySelectorAll("input");

  if(!errors){
    return;
  }

  if(errors.length <= 0){
    return;
  }

  for(var i =0; i < inputs.length; i++){

    var input = inputs[i];
    var input_name = input.getAttribute("name");

    for(var x = 0; x < errors.length; x++){

      if(input_name == errors[x].path){
        var container = document.querySelector(`#${input_name}_error`);
        container.innerHTML = ` <p class="validation_errror">* ${errors[x].msg} </p>`
      }

    }

  }

}

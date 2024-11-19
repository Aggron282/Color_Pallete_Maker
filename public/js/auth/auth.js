var create_account_btn = document.querySelector(".auth_button--create")
var create_account_form = document.querySelector(".auth_form--create")


if(create_account_form){

  create_account_form.addEventListener("submit",(e)=>{
    e.preventDefault()
    SubmitAccount(create_account_form,"/create_account")
  });

  create_account_btn.addEventListener("click",(e)=>{
    e.preventDefault()
    SubmitAccount(create_account_form,"/create_account")
  });

}

function SubmitAccount(form,url){
  var new_form = new FormData(form);
  const {data} = await axios.post(url,new_form);
  console.log(data);
}

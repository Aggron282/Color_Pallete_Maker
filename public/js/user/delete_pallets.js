var delete_palletes_btn;
var pallete_cards = document.querySelectorAll(".pallete_card");
var isDeleting = false;

if(document.querySelector("#delete-palletes")){

  var delete_palletes_btn = document.querySelector("#delete-palletes");

  delete_palletes_btn.addEventListener("click",(e)=>{

  isDeleting = !isDeleting;

  for(var i =0; i < pallete_cards.length; i++){

    var exit_button = pallete_cards[i].querySelector(".exit");

    exit_button.setAttribute("canDelete",pallete_cards[i].getAttribute("canDelete"));

    if(isDeleting){
      pallete_cards[i].classList.add("pallete_card--delete");
      pallete_cards[i].setAttribute("canDelete",1);
      exit_button.setAttribute("canDelete",pallete_cards[i].getAttribute("canDelete"))
      exit_button.classList.add("exit--active");
    }
    else{
      pallete_cards[i].classList.remove("pallete_card--delete")
      pallete_cards[i].setAttribute("canDelete",0);
      exit_button.setAttribute("canDelete",pallete_cards[i].getAttribute("canDelete"));
      exit_button.classList.remove("exit--active");
    }

  }


  if(isDeleting){
    delete_palletes_btn.innerText = "Cancel";
    delete_palletes_btn.classList.add("pallete_delete_btn--active")
  }else{
    delete_palletes_btn.innerText = "Delete Palletes";
    delete_palletes_btn.classList.remove("pallete_delete_btn--active")

  }

});
}

async function Delete(pallete_id,url){

  var url_ = !url ? window.location.href : url;
  const {data} = await axios.post("/delete",{pallete_id: pallete_id });

  if(data.feedback){
    window.location.assign(url_);
  }
  else{
    CreatePopup(data.msg,"error")
  }

}

function Init(){

  for(var i =0; i < pallete_cards.length; i++){

    var exit_button = pallete_cards[i].querySelector(".exit");

    exit_button.addEventListener("click",async (e)=>{

      var canDelete = e.target.getAttribute("canDelete");
      var pallete_id = e.target.getAttribute("_id");

      canDelete = parseInt(canDelete);

      if(canDelete == 1){
        Delete(pallete_id)
      }

    });

  }

}

if(document.querySelector("#delete-pallete")){

  var delete_pallete_btn = document.querySelector("#delete-pallete");

  delete_pallete_btn.addEventListener("click",async (e)=>{
        var pallete_id = e.target.getAttribute("_id");
        Delete(pallete_id,"/dashboard");
    });

}

Init();

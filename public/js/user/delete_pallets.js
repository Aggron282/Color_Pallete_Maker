var delete_pallets_btn = document.querySelector("#delete-pallets");
var pallet_cards = document.querySelectorAll(".pallet_card");
var isDeleting = false;

delete_pallets_btn.addEventListener("click",(e)=>{

  isDeleting = !isDeleting;

  for(var i =0; i < pallet_cards.length; i++){

    var exit_button = pallet_cards[i].querySelector(".exit");
    console.log(exit_button)
    exit_button.setAttribute("canDelete",pallet_cards[i].getAttribute("canDelete"));

    if(isDeleting){
      pallet_cards[i].classList.add("pallet_card--delete");
      pallet_cards[i].setAttribute("canDelete",1);
      exit_button.setAttribute("canDelete",pallet_cards[i].getAttribute("canDelete"))
      exit_button.classList.add("exit--active");
    }
    else{
      pallet_cards[i].classList.remove("pallet_card--delete")
      pallet_cards[i].setAttribute("canDelete",0);
      exit_button.setAttribute("canDelete",pallet_cards[i].getAttribute("canDelete"));
      exit_button.classList.remove("exit--active");
    }

  }


  if(isDeleting){
    delete_pallets_btn.innerText = "Cancel";
    delete_pallets_btn.classList.add("pallet_delete_btn--active")
  }else{
    delete_pallets_btn.innerText = "Delete Pallets";
    delete_pallets_btn.classList.remove("pallet_delete_btn--active")

  }

});

function Init(){

  for(var i =0; i < pallet_cards.length; i++){

    var exit_button = pallet_cards[i].querySelector(".exit");

    exit_button.addEventListener("click",async (e)=>{

      var canDelete = e.target.getAttribute("canDelete");
      var pallet_id = e.target.getAttribute("_id");
      canDelete = parseInt(canDelete);

      if(canDelete == 1){
  console.log({pallet_id: pallet_id })
        const {data} = await axios.post("/delete",{pallet_id: pallet_id });

        if(data.feedback){
          window.location.assign(window.location.href);
        }else{
          CreatePopup(data.err_msg,"error")
        }

      }

    });

  }

}

Init();

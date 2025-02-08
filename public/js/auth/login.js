var active_inputs = document.querySelectorAll(".auth_input");
var isWrong = false;

async function GrantAccessRings(cb){

  var rings = document.querySelectorAll(".ring");

  for(var i =0; i < rings.length;i++){
    await Delay(200);
    rings[i].classList.add("ring--grant");
  }

  await Delay(1000);

  for(var i =0; i < rings.length;i++){
    rings[i].classList.remove("ring--grant");
    rings[i].classList.add("ring--grant--full");
  }

 cb(true);

}

function ActivateRings(type){

  var active_counter =0;
  var rings = document.querySelectorAll(".ring");

  for(var i = 0; i < active_inputs.length; i++){

    if(active_inputs[i].value.length > 2){
      active_counter++;
    }

  }

  for(var i =0; i < rings.length;i++){
    rings[i].classList.remove(type);
  }

  for(var i =0; i <active_counter;i++){

    if(rings[i]){
      rings[i].classList.add(type);
    }

  }

}

for( var i =0; i <active_inputs.length; i++){

  active_inputs[i].addEventListener("change",(e)=>{

    ActivateRings("ring--active");

  });

}

window.onload = function () {
  ActivateRings("ring--active");
};

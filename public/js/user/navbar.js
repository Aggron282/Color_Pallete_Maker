var isDropped = false;
var dropdown = document.querySelector(".profile_dropdown_container");
var profile_container = document.querySelector(".profile_user_container");
var exit_nav = document.querySelector("#exit-nav")

exit_nav.addEventListener("click",(e)=>{
  console.log("d")
  ToggleDrop(false);
})

profile_container.addEventListener("click",(e)=>{
  console.log("s")
  isDropped = true;
  ToggleDrop(true);
});

function ToggleDrop(isDropped){
  console.log(isDropped)
  if(isDropped){
    dropdown.classList.add("profile_dropdown_container--dropped")
    profile_container.classList.add("profile_user_container--inactive")
  }
  else{
    dropdown.classList.remove("profile_dropdown_container--dropped")
    profile_container.classList.remove("profile_user_container--inactive")
  }

}

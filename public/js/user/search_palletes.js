var search_colors_form = document.querySelector(".search_colors_form");
var result_container = document.querySelector(".result_container");
var palletes_organized_container = document.querySelector(".organized_palletes_section");

search_colors_form.addEventListener("submit",(e)=>{
  e.preventDefault();
  SubmitSearch();
})

function ShowSearchContainer(){
  result_container.classList.add("pallete_search_results_container--active");
  palletes_organized_container.classList.add("palletes_organized_container--hidden");
}

function ExitSearch(){
  result_container.classList.remove("pallete_search_results_container--active");
  palletes_organized_container.classList.remove("organized_palletes_section--hidden");
  result_container.innerHTML = "";
}

async function SubmitSearch(){

  var form = new FormData(search_colors_form);
  var input = document.querySelector(".search_nav");

  if(input.value.length < 1){
    alert("Empty Value");
  }

  var {data} = await axios.post("/user/palletes/search",form);

  if(data){
    RenderResult(data.found_palletes);
  }
  else if(!data){
    alert("No Palletes Found");
  }
  else if(data.found_palletes.length <= 0){
    alert("No Palletes Found");
  }else{
    alert("No Palletes Found");
  }

}

function  RenderResult(palletes){

  result_container.innerHTML = ``;
  palletes_organized_container.innerHTML='';

  if(palletes.length <= 0){

     result_container.innerHTML += `

      <div class="no_result_container">
         <p class="title">No Results </p>
       </div>
       `;
  }else{
    RenderPalletes(palletes);
  }

  ShowSearchContainer();

}

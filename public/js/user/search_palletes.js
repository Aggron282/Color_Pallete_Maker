var search_colors_form = document.querySelector(".search_colors_form");

search_colors_form.addEventListener("submit",(e)=>{
  e.preventDefault();
  SubmitSearch();
})
async function SubmitSearch(){
  var form = new FormData(search_colors_form);
  console.log(form)
  var r = await axios.post("/user/palletes/search",form);
  console.log(r)
}

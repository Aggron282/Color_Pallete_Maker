function ReturnLoaderPalleteBox(){
  return `<div class="loading-container">
      <div class="movie-thumbnails" style="background-image: url('https://source.unsplash.com/400x250/?movie');"></div>
      <div class="spinner"></div>
  </div>`
}

function ReturnLoaderAI(){
  return `
  <div class="loading_container">
  <div class="loader">
      <div class="core"></div>
      <div class="electron"></div>
      <div class="electron"></div>
      <div class="electron"></div>
  </div>
    <p class="title">Loading..</p>
  </div>
  `
}

function RenderLoaderPalleteBoxes(container,amount){

  container.innerHTML = "";

  for(var i =0; i < amount; i++){
    container.innerHTML += ReturnLoaderPalleteBox();
  }

}

function RenderLoaderAI(container){
  console.log("Smw")
  container.innerHTML = ReturnLoaderAI();
}

var limit = 4;
var pages = 0;
var start_counter;
var organized_palletes = null;
var incr_x = 25;
var incr_y = 10;

const ScrollInElement = (element,count) => {

  if(!element){
    return;
  }

  offsetLeftProp = element.offsetLeft;
  element.scrollLeft = (Math.abs(1500)  * count);

}

function Init(){

  axios.get("/user/palletes/organized").then(({data})=>{

    organized_palletes = data.organized_palletes;

     for(var i =0; i < organized_palletes.length; i++){
       organized_palletes[i].counter = 0;
     }

     RenderMyPalletes(organized_palletes);

     category_scroll = document.querySelector("#category-scroll");

  })

}

function RenderPageNumbers(palletes,counter,container){

  var html = `<div class='paginate_container' id='page' page=${counter}>`;
  var len = Math.floor(palletes.length) / limit <= 5 ? Math.floor(palletes.length / limit): 5;

  len = len <= 0 ? 1 : len;

  for(var i = 0; i < len; i++){

    var active = "";

    if(palletes[i]){

      if(counter == i){
        active = "paginate--active"
      }

      container.innerHTML += `<span class="paginate ${active}" page=${i}> ${i+1} </span>`
    }
    else{
      break;
    }

  }

  html += "</div>"

  return html;

}

function RenderMyPalletes(organized_palletes){

  var html = `<div class="inner-container" >`;
  var container = document.querySelector(".organized_palletes_section");

  for(var i =0; i < organized_palletes.length; i ++) {


      container.innerHTML += `

      <div class="pallete_category_container">

        <a href="/category/${organized_palletes[i].category}">
          <p class="pallete_category_title">
            ${ organized_palletes[i].category.length > 0 ? organized_palletes[i].category : "Other"}
          </p>
        </a>

        <div class="palletes_in_category_container" category_id = "${organized_palletes[i].category}"></div>

       </div>
       <div class="page_number_container" category_id = "${organized_palletes[i].category}"></div>

       `
       var palletes_in_category_container = document.querySelector(`.palletes_in_category_container[category_id="${organized_palletes[i].category}"]`);
       var page_number_container = document.querySelector(`.page_number_container[category_id="${organized_palletes[i].category}"]`);

       var all_palletes_in_category = RenderPalletesInCategory(organized_palletes[i],palletes_in_category_container)
       var pagi = RenderPageNumbers(organized_palletes[i].palletes,organized_palletes[i].counter,page_number_container);

    }

    container.innerHTML += "</div>"

    var pages = document.querySelectorAll(".paginate_container");

    for(var i =0; i < pages.length; i++ ){

      pages[i].addEventListener("click",(e)=>{

        var pages = e.target.parentElement.querySelectorAll(".paginate");

        for(var z = 0; z <pages.length; z++){
          pages[z].classList.remove("paginate--active");
        }

        if(e.target.classList.contains("paginate")){

          var scrollbar = e.target.parentElement.parentElement.querySelector(".inner_category");
          var c = parseInt(e.target.getAttribute("page"))

          e.target.classList.add("paginate--active");

          ScrollInElement(scrollbar,c);

        }

      });

    }

}


Init();

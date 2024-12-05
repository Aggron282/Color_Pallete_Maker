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
  console.log(element, (Math.abs(incr_x)  * count))
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

function ReturnHTMLColorStripes(pallete){
  var html = ``;

  for(var x =0; x < pallete.colors.length; x ++) {

    var rgb = `rgb(${pallete.colors[x].r},${pallete.colors[x].g},${pallete.colors[x].b})`

   html += `<div class="color_stripe" style=background:${ rgb }>
     <p> ${ rgb} </p>
   </div>`

 }

 return html;

}

function ReturnColorBlobsHTML(pallete){

  var html = ``;

  for(var x =0; x < pallete.colors.length; x ++) {

    var rgb = `rgb(${pallete.colors[x].r},${pallete.colors[x].g},${pallete.colors[x].b})`

    html += `<div class="color_blob" style=background:${rgb}>  </div>`

 }

 return html;

}

function ReturnPageNumbersHTML(palletes,counter){

  var html = `<div class='paginate_container' id='page' page=${counter}>`;
  var len = Math.floor(palletes.length) / limit <= 5 ? Math.floor(palletes.length / limit): 5;

  len = len <= 0 ? 1 : len;

  for(var i = 0; i < len; i++){

    var active = "";

    if(palletes[i]){

      if(counter == i){
        active = "paginate--active"
      }

      html += `<span class="paginate ${active}" page=${i}> ${i+1} </span>`
    }
    else{
      break;
    }

  }

  html += "</div>"

  return html;

}

function ReturnPalletesInCategoryHTML(category){

  var x = category.counter * incr_x;
  var y = 0;
  var html = `<div class='inner_category' id="category-scroll">`;
  var category_len = category.palletes.length - (category.counter * limit);
  var len = category_len >= limit ? category.palletes.length : limit;

  for(var z = 0; z < len; z ++) {

    var pallete = category.palletes[z];
    if(!pallete){
      break;
    }
    var src_name = pallete.image;
    var src = src_name.substring(src_name.lastIndexOf('\\') + 1);

    html += `
    <div class="flip-card pallete_card"  isFlipped = "0" _id = "${ pallete.pallete_id }" style="position:absolute;left:${x}%;top:${0}%;" >

      <div class="exit" _id = "${ pallete.pallete_id }" >
          X
      </div>

    <a href="/pallete/${ pallete.pallete_id }">

      <div class="flip-card-inner">

        <div class="flip-card-front">

          <p class="pallete_title"> ${ pallete.name }</p>

          <div class="img_holder">
             <img src = "${src}"/>
          </div>

          ${ReturnColorBlobsHTML(pallete)}

        </div>

        <div class="flip-card-back">
          ${ReturnHTMLColorStripes(pallete)}
        </div>

       </div>

      </a>

    </div>`
    x+= incr_x
  }
  html += "</div>"
  return  html;

}

function AddFlipEffectToCards(){
  var pallete_cards = document.querySelector(".pallete_card");
  for(var i =0; i <pallete_cards.length; i++){
    pallete_cards[i].addEventListener("click",(e)=>{
      var isFlipped = e.target.getAttribute("isFlipped");
      if(isFlipped == 0){
        e.target.classList.add("flip-card--flipped")
        e.target.setAttribute("isFlipped","1")
      }else{
        e.target.classList.remove("flip-card--flipped")
        e.target.setAttribute("isFlipped","0")
      }
    });
  }
}

function RenderMyPalletes(organized_palletes){

  var html = `<div class="inner-container" >`;

     for(var i =0; i < organized_palletes.length; i ++) {

      var all_palletes_in_category = ReturnPalletesInCategoryHTML(organized_palletes[i])
      var pagi = ReturnPageNumbersHTML(organized_palletes[i].palletes,organized_palletes[i].counter);
      html += `
      <div class="pallete_category_container">

        <a href="/category/${organized_palletes[i].category}">
          <p class="pallete_category_title">
            ${ organized_palletes[i].category.length > 0 ? organized_palletes[i].category : "Other"}
          </p>
        </a>

        ${all_palletes_in_category}
        ${pagi}
       </div>
       `


     }

    html+="</div>"

    var container = document.querySelector(".organized_palletes_section");
    container.innerHTML = html;
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

          console.log(scrollbar,c);
          ScrollInElement(scrollbar,c);
          AddFlipEffectToCards();
        }
      });

    }



}

Init();

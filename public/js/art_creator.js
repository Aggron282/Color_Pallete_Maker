//  @type {HTMLCanvasElement}
 var canvas = document.querySelector("#csv");
var isDrawing = false;

csv = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.width = "100%";
canvas.style.height = "100%";
csv.fillStyle = "#FFF5DE"
csv.shadowOffsetX = 10;
csv.shadowOffsetY = 10;
csv.shadowBlur = 10;
csv.shadowColor = 'rgba(10,10,10,.3)';
csv.globalCompositeOperation = "source-over"
function RandomEvenNumber(min,max){
  var min = Math.ceil(min / 2) * 2;
  var max = Math.floor(max / 2) * 2;

  return Math.floor(Math.random() * ((max - min) / 2 + 1)) * 2 + min;
}

function RandomOddNumber(min,max){
  var min = Math.ceil(min / 3) * 3;
  var max = Math.floor(max / 3) * 3;

  return Math.floor(Math.random() * ((max - min) / 3 + 1)) * 3 + min;
}





class Root {

  constructor(x,y){
      this.x = x;
      this.y = x;
      console.log(x,y)
      this.speedX = Math.random() * 7 -2;
      this.speedY = Math.random() * 7 -2;
      this.maxSize =Math.random() * 7 + 20;
      this.angle_x = Math.random() * 6.2;
      this.angle_y = Math.random() * 6.2;
      this.size = Math.random() * .1 + .1;
      this.va_x = Math.random() * .6 - .3;
      this.vs = Math.random() * .2 + .05;
      this.va_y = Math.random() * .1 - .3;
      this.va = Math.random() * .1 +.05;
      this.angle =0;
      this.willGrow = this.maxSize >= 11 ? true : false;
    }
      update(){

        this.x += this.speedX + Math.sin(this.angle_y);
        this.y += this.speedY + Math.sin(this.angle_x);
        this.angle_x += this.va_x;
        this.angle_y += this.va_y;
        this.size += this.vs;
        this.angle += this.va;
        if(this.size <= this.maxSize){

          csv.save();
          csv.translate(this.x,this.y);
          csv.rotate(this.angle);

          var half = this.size / 2
          var double = this.size * 2;
          var triple = this.size * 2;

          csv.fillRect(0 - half ,0 -half,this.size,this.size)

          csv.strokeStyle = "#3c5186";
          csv.lineWidth = .5;

          csv.strokeRect(0 - this.size,0 -this.size,double,double);
          csv.strokeStyle = "white";
          csv.lineWidth = .2;
          csv.strokeRect(0 - triple / 2,0 - triple /2,triple,triple);

          csv.restore();
        //  csv.beginPath()
        //  csv.arc(this.x,this.y,this.size,0, Math.PI * 2)
        // csv.fillStyle = `rgba(${Math.ceil(Math.random() * 254)},${Math.ceil(Math.random() * 254)},${Math.ceil(Math.random() * 254)},.9)`
          // csv.fillStyle = `hsl(140,100%,50%)`
      //    csv.fill();
        //  csv.stroke();
          requestAnimationFrame(this.update.bind(this))
        }

      }

}

window.addEventListener("mousemove",function(e){

  if(!isDrawing){
    return;
  }else{

    for(var i =0; i <3; i++){
    	var root = new Root(e.x ,e.y)
      root.update();
    }

  }

})


window.addEventListener("mousedown",function(e){
  isDrawing = true;

  for(var i =0; i <1000; i++){
    var root = new Root(e.x ,e.y)
    root.update();
  }

})

window.addEventListener("mouseup",function(e){
  isDrawing = false;
})

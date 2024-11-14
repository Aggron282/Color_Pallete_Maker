//  @type {HTMLCanvasElement}
 var canvas = document.querySelector("#csv");
var isDrawing = false;

csv = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.width = "100%";
canvas.style.height = "100%";
// csv.globalCompositeOperation = "destination-over"


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
      this.maxSize =Math.random() * 7 + 5;
      this.angle_x = Math.random() * 6.2;
      this.angle_y = Math.random() * 6.2;
      this.size = Math.random() * .1 + .1;
      this.va_x = Math.random() * .6 - .3;
      this.vs = Math.random() * .05 + .05;
      this.va_y = Math.random() * .6 - .3;
      this.willGrow = this.maxSize >= 11 ? true : false;
    }
      update(){

        this.x += this.speedX + Math.sin(this.angle_y);
        this.y += this.speedY + Math.sin(this.angle_x);
        this.angle_x += this.va_x;
        this.angle_y += this.va_y;
        this.size += this.vs;
        if(this.size <= this.maxSize){
          csv.beginPath()
          csv.arc(this.x,this.y,this.size,0, Math.PI * 2)
        // csv.fillStyle = `rgba(${Math.ceil(Math.random() * 254)},${Math.ceil(Math.random() * 254)},${Math.ceil(Math.random() * 254)},.9)`
           csv.fillStyle = `hsl(140,100%,50%)`
          csv.fill();
          csv.stroke();
          requestAnimationFrame(this.update.bind(this))
        }
        else{
          if(this.willGrow){
            const flower = new Flower(this.x,this.y,this.size);
            flower.grow()
          }
        }

      }

}

class Flower {

  constructor(x,y,size){
    var src = "/imgs/flowers/";
    var random_flowers = ["blue_1","blue_2","blue_3"];
    var index = Math.floor(Math.random() * random_flowers.length);
    this.x = x;
    this.y = y;
    this.size = size;
    this.frameSize = 50;
    this.frameX = Math.floor(Math.random() * 3);
    this.frameY = Math.floor(Math.random() * 3);
    this.maxFlowerSize = this.size * Math.random() *  20 + 10
    this.image = new Image()
    this.angle = 0;
    this.va = Math.random() * 1 - .5;
    this.image.src = `${src}${random_flowers[2]}.png`
  }

  grow(){

    if(this.size < this.maxFlowerSize){
      this.size += 1;
      this.angle += this.va;
      csv.save();
      csv.translate(this.x,this.y);
      csv.rotate(this.angle)
      csv.drawImage(this.image,
        this.frameSize * this.frameX, this.frameSize * this.frameY,
        this.frameSize,this.frameSize,
        0 - this.size / 2, 0 - this.size / 2,this.size,this.size)

      csv.restore();

      requestAnimationFrame(this.grow.bind(this))

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

  for(var i =0; i <50; i++){
    var root = new Root(e.x ,e.y)
    root.update();
  }

})

window.addEventListener("mouseup",function(e){
  isDrawing = false;
})

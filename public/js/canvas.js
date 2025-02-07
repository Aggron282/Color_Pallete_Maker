function Galaxy(){
const canvas = document.querySelector('#galaxy');
const click_me = document.querySelector(".click_me");
const c = canvas.getContext('2d')

let particles;
let radian = 0;
let alpha = 0;
let mouse_down = false;

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {

  canvas.width = innerWidth
  canvas.height = innerHeight

  init();

})

addEventListener('mousedown', () => {

  mouse_down = true;

  if(click_me.classList.contains("click_me--inactive") == false){
    click_me.classList.add("click_me--inactive")
  }

})

addEventListener('mouseup', () => {
  mouse_down = false;
  click_me.classList.remove("click_me--inactive")
})

class Particle {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.shadowColor = this.color;
    c.shadowBlur = 15;
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
  }
}


function init() {
  particles = []

  for (let i = 0; i < 500; i++) {

    const height = canvas.height + 300;
    const width = canvas.width +300;

    const x = Math.random() * width - width / 2;
    const y = Math.random() * height - height / 2;

    const size = Math.random() * 2   ;

    var color = `rgb(${Math.floor(Math.random() * 255 + 50)},${Math.floor(Math.random() * 255 + 50)},${Math.floor(Math.random() * 255 + 50)})`

    particles.push(new Particle(
      x,y,size,color
    ))

  }

}

// Animation Loop
function animate() {
  const height = canvas.height + 300;
  const width = canvas.width +300;
  requestAnimationFrame(animate)

  c.fillStyle=`rgba(0,0,0,${alpha})`

  c.fillRect(0, 0, canvas.width, canvas.height)

  c.save();

  c.translate(
    width / 2,
    height / 2
  )

  c.rotate(radian);

  particles.forEach(particle => {
   particle.update()
  })


  c.restore();

  if(mouse_down && alpha > .05){
    alpha -= 0.01;
  }else if (!mouse_down && alpha < 1){
    alpha += .001;
  }
  if(!mouse_down){
    radian += .0005;
  }else{
    radian += .003;
  }

}

init()
animate()

}
Galaxy();

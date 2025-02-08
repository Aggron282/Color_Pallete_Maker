function InitIntroCanvas(){

  const canvas = document.getElementById('intro');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let numParticles = 45;
  let trails = [];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;


  function getRandomYellowOrBlue() {

      if (Math.random() > 0.5) {

          let r = 200 + Math.random() * 55; // 200-255
          let g = 200 + Math.random() * 55; // 200-255
          let b = Math.random() * 100; // 0-100

          return `rgba(${r}, ${g}, ${b}, 1)`;

      }
      else {

          let r = Math.random() * 100; // 0-100
          let g = Math.random() * 150; // 0-150
          let b = 200 + Math.random() * 55; // 200-255

          return `rgba(${r}, ${g}, ${b}, 1)`;

      }
  }

  class Particle {
      constructor() {
          this.x = 0;
          this.y = Math.random() * 100 ;
          this.radius = Math.random() * 2 + 1;
          this.color = getRandomYellowOrBlue();
          this.t = 0;
          this.speed = Math.random() * 0.0009 + 0.01;
          this.controlX1 = Math.random() * (canvas.width * 0.3);
          this.controlY1 = canvas.height - Math.random() * (canvas.height * 2);
          this.controlX2 = canvas.width - Math.random() * (canvas.width * .9);
          this.controlY2 = Math.random() * (canvas.height * 0.4) + (canvas.height * 1.5);
          this.endX = canvas.width;
          this.endY = 0;
      }
      draw() {
          ctx.beginPath();
          ctx.fillStyle = "yellow";
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
      }
      update() {
          this.t += this.speed - Math.random() * .0000000001;
          if (this.t > 1.2) {
              this.t = 1.2;
          }

          let prevX = this.x;
          let prevY = this.y;

          this.x = (1 - this.t) ** 3 * 0 +
                   3 * (1 - this.t) ** 2 * this.t * this.controlX1 +
                   3 * (1 - this.t) * this.t ** 2 * this.controlX2 +
                   this.t ** 3 * this.endX;

          this.y = (1 - this.t) ** 3 * canvas.height +
                   1 * (1 - this.t) ** 2 * this.t * this.controlY1 +
                   3 * (1 - this.t) * this.t ** 2 * this.controlY2 +
                   this.t ** 3 * this.endY;

          trails.push({ x: prevX, y: prevY, color: this.color });

          // trails.forEach((trail)=>{
          //   if(Math.random() * 100 > 99.5){
          //     trail.x += Math.random() * .005
          //     trail.y += Math.random() *   .007;
          //   }
          // });

      }
  }

  function init() {

      particles = [];

      for (let i = 0; i < numParticles; i++) {
          particles.push(new Particle());
      }

  }

  function animate() {

      ctx.fillStyle = 'rgba(0, 0, 0, .1)';

      ctx.fillRect(0, 0, canvas.width, canvas.height);

      trails.forEach(trail => {
          ctx.beginPath();
          ctx.fillStyle = trail.color;
          ctx.arc(trail.x, trail.y, 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
      });

      particles.forEach(particle => {
          particle.update();
          particle.draw();
      });

      requestAnimationFrame(animate);

  }

  init();
  animate();

}

InitIntroCanvas();

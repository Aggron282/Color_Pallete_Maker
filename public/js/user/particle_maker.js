function InitDisplayParticle(){
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  let particles = [];

  document.getElementById("createParticle").addEventListener("click", () => {
      const size = document.getElementById("size").value;
      const speed = document.getElementById("speed").value;
      const color = document.getElementById("color").value;
      const randomize = document.getElementById("randomize").checked;

      createParticle(size, speed, color, randomize);
  });

  function createParticle(size, speed, color, randomize) {
      let finalSize = randomize ? Math.random() * (100 - 5) + 5 : size;
      let finalSpeed = randomize ? Math.random() * (10 - 1) + 1 : speed;

      particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: finalSize,
          speedY: finalSpeed,
          color: color
      });
  }

  function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          // Movement
          particle.y += particle.speedY;

          // Bounce effect
          if (document.getElementById("bounce").checked) {
              if (particle.y + particle.size >= canvas.height || particle.y - particle.size <= 0) {
                  particle.speedY *= -1;
              }
          }

          // Gravity effect
          if (document.getElementById("gravity").checked) {
              particle.speedY += 0.1;
          }

          // Remove out-of-bounds particles
          if (particle.y > canvas.height) {
              particles.splice(index, 1);
          }
      });

      requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

InitDisplayParticle();

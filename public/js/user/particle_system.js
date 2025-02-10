var has_created_particle = false;
var copy_paste_button = document.querySelector("#download_code")
class Particle {
    constructor(x, y, size, speedX, speedY, color, shape, image, glow, growthSize, growthSpeed, behavior, context) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
        this.shape = shape;
        this.image = image;
        this.glow = glow;
        this.behavior = behavior;
        this.ctx = context;
        this.growthSize = growthSize || 0.0005; // More subtle size growth
        this.growthSpeed = growthSpeed || 0.0005; // Subtle acceleration
        this.angle = Math.random() * Math.PI * 2;
        this.orbitRadius = 250 + Math.random() * 100; // Larger orbit range
    }

    draw() {
        if (this.size <= 0) return; // Remove particles that are too small

        this.ctx.save();
        if (this.glow) {
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = this.color;
        }
        this.ctx.globalAlpha = 0.85; // Slight transparency

        if (this.image) {
            let img = new Image();
            img.src = this.image;
            this.ctx.drawImage(img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        } else {
            this.ctx.fillStyle = this.color;
            this.ctx.beginPath();
            if (this.shape === "circle") {
                this.ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            } else if (this.shape === "square") {
                this.ctx.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
            }
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    update(centerX, centerY, canvasWidth, canvasHeight) {
        switch (this.behavior) {
            case "swirl":
                this.angle += 0.02;
                this.x += Math.cos(this.angle) * 1.2;
                this.y += Math.sin(this.angle) * 1.2;
                break;
            case "gravity":
                this.speedY = Math.min(this.speedY + 0.005, 0.4); // Smooth gravity effect
                break;
            case "anti-gravity":
                this.speedY = Math.max(this.speedY - 0.005, -0.4); // Smooth anti-gravity effect
                break;
            case "orbit":
                this.angle += 0.012;
                this.x = centerX + Math.cos(this.angle) * this.orbitRadius;
                this.y = centerY + Math.sin(this.angle) * this.orbitRadius;
                break;
            case "attraction":
                let dx = centerX - this.x;
                let dy = centerY - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 25) {
                    this.speedX += (dx / distance) * 0.01;
                    this.speedY += (dy / distance) * 0.01;
                }
                this.size -= 0.02; // Smooth shrinking effect
                if (this.size < 0) this.size = 0;
                break;
            case "repulsion":
                let repulseDx = this.x - centerX;
                let repulseDy = this.y - centerY;
                let repulseDistance = Math.sqrt(repulseDx * repulseDx + repulseDy * repulseDy);
                if (repulseDistance < 350) {
                    this.speedX += (repulseDx / repulseDistance) * 0.3;
                    this.speedY += (repulseDy / repulseDistance) * 0.3;
                }
                break;
            default:
                break;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        if(this.behavior !== "bounce"){
          this.speedX *= 0.99998; // Apply friction
          this.speedY *= 0.99998;
      }else{
        this.speedX *= 0.999998; // Apply friction
        this.speedY *= 0.990998;
      }

        if (this.behavior === "bounce") {
            if (this.x <= 0 || this.x >= canvasWidth) this.speedX *= -0.9; // Energy loss
            if (this.y <= 0 || this.y >= canvasHeight) this.speedY *= -0.9;
        }
    }
}

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.particles = [];
        this.spawnInterval = null;
        this.animationRunning = false;
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles(config) {
        this.clearCanvas();
        this.particles = [];

        if (this.spawnInterval) clearInterval(this.spawnInterval);
        if (config.spawnOverTime) {
            this.startSpawningParticles(config);
        } else {
            this.spawnParticles(config);
        }
    }

    startSpawningParticles(config) {
        this.spawnInterval = setInterval(() => {
            this.spawnParticles(config);
        }, 1000);
    }

    spawnParticles(config) {
        const spawnArea = getSpawnArea();
        const centerX = spawnArea.x + spawnArea.width ;
        const centerY = spawnArea.y + spawnArea.height;

        for (let i = 0; i < config.amount; i++) {
            let x = spawnArea.x + Math.random() * spawnArea.width;
            let y = spawnArea.y + Math.random() * spawnArea.height;

            let size = config.randomize ? Math.random() * config.size : config.size;
            let speedX = (config.velocityX !== 0 ? config.velocityX : Math.random() - 0.5) * config.speed;
            let speedY = (config.velocityY !== 0 ? config.velocityY : Math.random() - 0.5) * config.speed;
            let color = config.color;
            let image = config.image || null;
            let behavior = config.behavior || "none";

            this.particles.push(new Particle(
                x, y, size, speedX, speedY, color,
                config.shape, image, config.glow, config.growthSize, config.growthSpeed, behavior, this.ctx
            ));
        }

        if (!this.animationRunning) {
            this.animationRunning = true;
            this.startAnimation(centerX, centerY);
        }
    }

    startAnimation(centerX, centerY) {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles = this.particles.filter(p => p.size > 0);
            this.particles.forEach(p => {
                p.update(centerX, centerY, this.canvas.width, this.canvas.height);
                p.draw();
            });
            requestAnimationFrame(animate);
        };
        animate();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = [];
        this.animationRunning = false;
        if (this.spawnInterval) clearInterval(this.spawnInterval);
    }
}

// ✅ Never delete this function
function getSpawnArea() {
    const square = document.getElementById("draggable-square");
    const canvas = document.getElementById("particle-render-canvas");

    if (!square || !canvas) {
        console.error("Draggable square or canvas not found!");
        return { x: 0, y: 0, width: 0, height: 0 };
    }

    const squareRect = square.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;

    return {
        x: (squareRect.left - canvasRect.left) * scaleX,
        y: (squareRect.top - canvasRect.top) * scaleY,
        width: squareRect.width * scaleX,
        height: squareRect.height * scaleY
    };
}

function getParticleSettings() {
    return {
        spawnOverTime: document.getElementById("spawnOverTime")?.checked || false,
        amount: parseInt(document.getElementById("amount").value) || 100,
        size: parseFloat(document.getElementById("size").value) || 10,
        speed: parseFloat(document.getElementById("speed").value) || 2,
        velocityX: parseFloat(document.getElementById("velocityX").value) || 0,
        velocityY: parseFloat(document.getElementById("velocityY").value) || 0,
        color: document.getElementById("color").value || "#ffffff",
        shape: document.querySelector('input[name="shape"]:checked')?.id || "circle",
        behavior: document.querySelector('input[name="behavior"]:checked')?.id || "none",
        randomize: document.getElementById("randomize")?.checked || false,
        glow: document.getElementById("glow")?.checked || false
    };
}

const particleSystem = new ParticleSystem("particle-render-canvas");

document.getElementById("createParticle").addEventListener("click", () => {
    const config = getParticleSettings();
    particleSystem.createParticles(config);
    has_created_particle = true;
    generateParticleHTML(config);
    var btn = document.getElementById("download_code");
    ToggleCopyPasteButton(btn,has_created_particle);
});

function ToggleCopyPasteButton(btn,isOn){
  if(isOn){
    btn.classList.add("copy_paste_button--active")
    btn.setAttribite("isOn",1)
  }else{
    btn.classList.remove("copy_paste_button--active")
    btn.setAttribite("isOn",0)
  }
}


function generateParticleHTML(config) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Particle System</title>
    <style>
        body { margin: 0; overflow: hidden; background: black; }
        canvas { display: block; }
    </style>
</head>
<body>
    <canvas id="particle-render-canvas"></canvas>
    <script>
        class Particle {
            constructor(x, y, size, speedX, speedY, color, shape, glow, behavior, context) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.speedX = speedX;
                this.speedY = speedY;
                this.color = color;
                this.shape = shape;
                this.glow = glow;
                this.behavior = behavior;
                this.ctx = context;
                this.angle = Math.random() * Math.PI * 2;
                this.orbitRadius = 100 + Math.random() * 50; // Adjust orbit behavior range
            }

            draw() {
                this.ctx.save();
                if (this.glow) {
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = this.color;
                }
                this.ctx.fillStyle = this.color;
                this.ctx.beginPath();
                if (this.shape === "circle") {
                    this.ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
                } else {
                    this.ctx.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
                }
                this.ctx.fill();
                this.ctx.restore();
            }

            update(centerX, centerY, canvasWidth, canvasHeight) {
                switch (this.behavior) {
                    case "orbit":
                        this.angle += 0.02;
                        this.x = centerX + Math.cos(this.angle) * this.orbitRadius;
                        this.y = centerY + Math.sin(this.angle) * this.orbitRadius;
                        break;
                    case "gravity":
                        this.speedY += 0.01;
                        break;
                    case "repulsion":
                        let dx = this.x - centerX;
                        let dy = this.y - centerY;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 250) {
                            this.speedX += (dx / distance) * 0.5;
                            this.speedY += (dy / distance) * 0.5;
                        }
                        break;
                    case "attraction":
                        let ax = centerX - this.x;
                        let ay = centerY - this.y;
                        let dist = Math.sqrt(ax * ax + ay * ay);
                        if (dist > 10) {
                            this.speedX += (ax / dist) * 0.02;
                            this.speedY += (ay / dist) * 0.02;
                        }
                        break;
                }

                this.x += this.speedX;
                this.y += this.speedY;
            }
        }

        class ParticleSystem {
            constructor(canvasId) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext("2d");
                this.particles = [];
                this.resizeCanvas();
                window.addEventListener("resize", () => this.resizeCanvas());
                this.createParticles();
            }

            resizeCanvas() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }

            createParticles() {
                this.particles = [];
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                for (let i = 0; i < ${config.amount}; i++) {
                    let x = Math.random() * this.canvas.width;
                    let y = Math.random() * this.canvas.height;
                    let size = ${config.randomize} ? Math.random() * ${config.size} : ${config.size};
                    let speedX = (${config.velocityX} !== 0 ? ${config.velocityX} : (Math.random() - 0.5) * ${config.speed});
                    let speedY = (${config.velocityY} !== 0 ? ${config.velocityY} : (Math.random() - 0.5) * ${config.speed});
                    let color = "${config.color}";
                    let shape = "${config.shape}";
                    let glow = ${config.glow};
                    let behavior = "${config.behavior}";

                    this.particles.push(new Particle(x, y, size, speedX, speedY, color, shape, glow, behavior, this.ctx));
                }
                this.startAnimation(centerX, centerY);
            }

            startAnimation(centerX, centerY) {
                const animate = () => {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.particles.forEach(p => {
                        p.update(centerX, centerY, this.canvas.width, this.canvas.height);
                        p.draw();
                    });
                    requestAnimationFrame(animate);
                };
                animate();
            }
        }

        new ParticleSystem("particle-render-canvas");
    </script>
</body>
</html>
    `;
}

function downloadParticleHTML(config) {
    const htmlContent = generateParticleHTML(config);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated_particles.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById("download_code").addEventListener("click", () => {
    if(has_created_particle){
      const config = getParticleSettings();
      downloadParticleHTML(config);
    }
});

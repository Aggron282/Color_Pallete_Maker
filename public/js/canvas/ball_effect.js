const numBalls = 50;
const balls = [];
const changedBalls = new Set(); // Store changed balls for correct reversion

function createGlowBall(x, y, container) {
    const ball = document.createElement("div");
    ball.classList.add("glow-ball");
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
    container.appendChild(ball);
    return ball;
}

function generateGlowBalls(container) {
    for (let i = 0; i < numBalls; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const ball = createGlowBall(x, y, container);
        balls.push(ball);
    }
}

function turnFractionColor(color, fr) {
    let count = 0;
    while (count < numBalls / fr) {
        let index = Math.floor(Math.random() * balls.length);
        let ball = balls[index];

        if (!ball.classList.contains("permanent")) {
            ball.style.background = color;
            ball.style.transition = ".5s all";
            ball.style.transform = "translateY(-5px)";
            ball.classList.add("permanent");
            changedBalls.add(ball); // Store changed balls
            count++;
        }
    }
}

function revertFractionColor( originalColor,fr) {
    let glowingBalls = Array.from(changedBalls); // Get all glowing balls
    let count = 0;

    while (count < glowingBalls.length / fr && glowingBalls.length > 0) {
        let index = Math.floor(Math.random() * glowingBalls.length);
        let ball = glowingBalls[index];

        if (ball.classList.contains("permanent")) {
            ball.style.background = originalColor;
            ball.style.transform = "translateY(0px)";
            ball.classList.remove("permanent");
            changedBalls.delete(ball); // Remove from tracking set
            count++;
        }

        glowingBalls.splice(index, 1); // Remove from selection to prevent duplicate picking
    }
}

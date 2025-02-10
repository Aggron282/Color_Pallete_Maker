const square = document.getElementById("draggable-square");
let isDragging = false;
let isResizing = false;
let startX, startY, startWidth, startHeight, startLeft, startTop;
let activeHandle = null;


square.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("resize-handle")) return; // Prevent dragging when resizing
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = square.offsetLeft;
    startTop = square.offsetTop;
    square.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        let newX = startLeft + (e.clientX - startX);
        let newY = startTop + (e.clientY - startY);
        square.style.left = `${newX}px`;
        square.style.top = `${newY}px`;
    } else if (isResizing && activeHandle) {
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;

        if (activeHandle.classList.contains("top-left")) {
            square.style.width = `${startWidth - dx}px`;
            square.style.height = `${startHeight - dy}px`;
            square.style.left = `${startLeft + dx}px`;
            square.style.top = `${startTop + dy}px`;
        } else if (activeHandle.classList.contains("top-right")) {
            square.style.width = `${startWidth + dx}px`;
            square.style.height = `${startHeight - dy}px`;
            square.style.top = `${startTop + dy}px`;
        } else if (activeHandle.classList.contains("bottom-left")) {
            square.style.width = `${startWidth - dx}px`;
            square.style.height = `${startHeight + dy}px`;
            square.style.left = `${startLeft + dx}px`;
        } else if (activeHandle.classList.contains("bottom-right")) {
            square.style.width = `${startWidth + dx}px`;
            square.style.height = `${startHeight + dy}px`;
        } else if (activeHandle.classList.contains("top")) {
            square.style.height = `${startHeight - dy}px`;
            square.style.top = `${startTop + dy}px`;
        } else if (activeHandle.classList.contains("bottom")) {
            square.style.height = `${startHeight + dy}px`;
        } else if (activeHandle.classList.contains("left")) {
            square.style.width = `${startWidth - dx}px`;
            square.style.left = `${startLeft + dx}px`;
        } else if (activeHandle.classList.contains("right")) {
            square.style.width = `${startWidth + dx}px`;
        }
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    isResizing = false;
    activeHandle = null;
    square.style.cursor = "grab";
});

// Resizing Functionality
document.querySelectorAll(".resize-handle").forEach(handle => {
    handle.addEventListener("mousedown", (e) => {
        isResizing = true;
        activeHandle = e.target;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = square.offsetWidth;
        startHeight = square.offsetHeight;
        startLeft = square.offsetLeft;
        startTop = square.offsetTop;
        e.stopPropagation();
    });
});


function getSquareData(squareElement) {
    const rect = squareElement.getBoundingClientRect();

    // Define corners
    const points = {
        topLeft: { x: rect.left, y: rect.top },
        topRight: { x: rect.right, y: rect.top },
        bottomLeft: { x: rect.left, y: rect.bottom },
        bottomRight: { x: rect.right, y: rect.bottom },
    };

    // Generate a random point inside the square
    points.random = {
        x: Math.random() * (rect.right - rect.left) + rect.left,
        y: Math.random() * (rect.bottom - rect.top) + rect.top
    };

    return points;
}

function getRandomSquarePosition() {
    const square = document.getElementById("draggable-square");
    const canvas = document.getElementById("particle-render-canvas");
    const squareRect = square.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    return {
        x: squareRect.left - canvasRect.left + Math.random() * squareRect.width, // Adjust X for canvas
        y: squareRect.top - canvasRect.top + Math.random() * squareRect.height // Adjust Y for canvas
    };
}

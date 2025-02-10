var library_chosen = null;
const displayContainer = document.querySelector(".particle-menu-box--display");

// Object containing all menu templates
const menuTemplates = {
    fireworks: `
        <div class="menu-box" id="fireworks-menu">
            <h3 class="menu-title">Fireworks.js</h3>
            <label>Speed: <input type="range" id="fireworks-speed" min="1" max="10" value="5"></label>
            <label>Explosion Size: <input type="range" id="fireworks-size" min="5" max="100" value="20"></label>
        </div>`,
    particlesjs: `
        <div class="menu-box" id="particlesjs-menu">
            <h3 class="menu-title">Particles.js</h3>
            <label>Particle Count: <input type="range" id="particlesjs-count" min="10" max="200" value="100"></label>
            <label>Particle Size: <input type="range" id="particlesjs-size" min="1" max="10" value="3"></label>
        </div>`,
    tsparticles: `
        <div class="menu-box" id="tsparticles-menu">
            <h3 class="menu-title">tsParticles</h3>
            <label>Particle Speed: <input type="range" id="tsparticles-speed" min="1" max="10" value="5"></label>
            <label>Particle Shape:
                <select id="tsparticles-shape">
                    <option value="circle">Circle</option>
                    <option value="star">Star</option>
                    <option value="square">Square</option>
                </select>
            </label>
        </div>`,
    threejs: `
        <div class="menu-box" id="threejs-menu">
            <h3 class="menu-title">Three.js</h3>
            <label>Particle Count: <input type="range" id="threejs-count" min="50" max="500" value="100"></label>
        </div>`,
    pixijs: `
        <div class="menu-box" id="pixijs-menu">
            <h3 class="menu-title">Pixi.js</h3>
            <label>Particle Amount: <input type="range" id="pixijs-amount" min="10" max="300" value="100"></label>
        </div>`,
    customEngine: `
        <div class="menu-box" id="customEngine-menu">
            <h3 class="menu-title">Custom Engine</h3>
            <label>Speed: <input type="range" id="customEngine-speed" min="1" max="10" value="5"></label>
            <label>Size: <input type="range" id="customEngine-size" min="5" max="50" value="20"></label>
        </div>`
};

// Mapping checkboxes to their respective menu IDs
const checkboxes = {
    fireworksToggle: "fireworks",
    particleJSToggle: "particlesjs",
    tsparticles: "tsparticles",
    threeToggle: "threejs",
    pixiToggle: "pixijs",
    customEngineToggle: "customEngine"
};
function InitLibraryMenu() {



    Object.keys(checkboxes).forEach((checkboxId) => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.addEventListener("change", function () {
                updateMenuUI(this);
                console.log("Library Chosen:", library_chosen); // Debugging output
            });
        }
    });

    displayContainer.innerHTML = "";

}

document.querySelectorAll('input[name="library"]').forEach(checkbox => {
    checkbox.addEventListener("change", function () {
        updateMenuUI(this); // Ensures only one library is selected
    });
});
function updateMenuUI(selectedCheckbox) {
// Uncheck all checkboxes except the one just clicked
let isChecked = false;
Object.keys(checkboxes).forEach((checkboxId) => {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox && checkbox !== selectedCheckbox) {
        checkbox.checked = false;
    }
    if (checkbox && checkbox.checked) {
        isChecked = true;
    }
});

// Clear the display container
displayContainer.innerHTML = "";

// If no checkboxes are selected, reset library_chosen to null
if (!isChecked) {
    library_chosen = null;
    return;
}

// Get the selected library's menu and add it to the container
if (selectedCheckbox.checked) {
    const selectedMenuKey = checkboxes[selectedCheckbox.id];
    if (menuTemplates[selectedMenuKey]) {
        library_chosen = selectedMenuKey;
        displayContainer.innerHTML = menuTemplates[selectedMenuKey];
    }
}
}


InitLibraryMenu();

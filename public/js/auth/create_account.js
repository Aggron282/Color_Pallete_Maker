const originalColor = "radial-gradient(circle, rgba(128, 0, 128, 1) 30%, rgba(75, 0, 130, 1) 80%)";
const newColor = "radial-gradient(circle, rgba(255, 255, 0, 1) 30%, rgba(255, 200, 0, 1) 80%)";
const fr = 4;

function InitCreateAccountPage() {
    let currentStep = 0;
    const steps = document.querySelectorAll(".form-step");
    const progressBar = document.getElementById("progress");
    const submitButton = document.querySelector("button[type='submit']");
    const formInputs = document.querySelectorAll("#accountForm input:not([type='file'])");
    var container = document.querySelector(".glow-container")

    generateGlowBalls(container);

    submitButton.disabled = true;

    document.getElementById("profilePic").addEventListener("change", function () {
        const input = this;
        const display = document.getElementById("profileImage");
        const previewContainer = document.getElementById("imagePreview");

        const file = input.files[0];
        if (file) {
            display.src = URL.createObjectURL(file);
            previewContainer.style.display = "block";
        }
    });

    function collectFormData() {
        const formData = new FormData();
        formData.append("firstName", document.getElementById("firstName").value);
        formData.append("lastName", document.getElementById("lastName").value);
        formData.append("username", document.getElementById("username").value);
        formData.append("password", document.getElementById("password").value);

        const profilePic = document.getElementById("profilePic").files[0];
        if (profilePic) {
            formData.append("profilePic", profilePic);
        }

        return formData;
    }

    function validateForm() {
        let allFilled = true;
        formInputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = "red";
                allFilled = false;
            } else {
                input.style.borderColor = ""; // Reset if filled
            }
        });
        submitButton.disabled = !allFilled;
    }

    function saveToLocalStorage() {
        const userData = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            username: document.getElementById("username").value,
            profilePic: document.getElementById("profileImage").src || null
        };
        localStorage.setItem("userData", JSON.stringify(userData));
    }

    function loadFromLocalStorage() {
        const savedData = JSON.parse(localStorage.getItem("userData"));
        if (savedData) {
            document.getElementById("firstName").value = savedData.firstName || "";
            document.getElementById("lastName").value = savedData.lastName || "";
            document.getElementById("username").value = savedData.username || "";
            validateForm(); // Validate inputs on load

            if (savedData.profilePic) {
                document.getElementById("profileImage").src = savedData.profilePic;
                document.getElementById("imagePreview").style.display = "block";
            }
        }
    }

    window.nextStep = function () {
        if (currentStep < steps.length - 1) {
            steps[currentStep].classList.remove("active");
            currentStep++;
            steps[currentStep].classList.add("active");
            progressBar.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;
            turnFractionColor(newColor,fr)
            if (currentStep === steps.length - 1) {
                const formData = collectFormData();
                let reviewText = "";

                ["firstName", "lastName", "username"].forEach(field => {
                    const value = formData.get(field);
                    reviewText += `<strong>${field.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${value || "<span style='color:red;'>Required</span>"}<br>`;
                });

                document.getElementById("reviewData").innerHTML = reviewText;
            }
        }
    };

    window.prevStep = function (fr_) {
        if (currentStep > 0) {
            revertFractionColor(originalColor,fr_)
            steps[currentStep].classList.remove("active");
            currentStep--;
            steps[currentStep].classList.add("active");
            progressBar.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;
        }
    };

    document.getElementById("accountForm").addEventListener("submit", function (event) {
        event.preventDefault();
        saveToLocalStorage();
        alert("Account Created Successfully!");
    });

    formInputs.forEach(input => input.addEventListener("input", validateForm));

    loadFromLocalStorage();
}

InitCreateAccountPage();

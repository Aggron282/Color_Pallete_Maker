const originalColor = "radial-gradient(circle, rgba(128, 0, 128, 1) 30%, rgba(75, 0, 130, 1) 80%)";
const newColor = "radial-gradient(circle, rgba(255, 255, 0, 1) 30%, rgba(255, 200, 0, 1) 80%)";
const fr = 4;

function InitCreateAccountPage() {
    let currentStep = 0;
    const steps = document.querySelectorAll(".form-step");
    const progressBar = document.getElementById("progress");
    const formInputs = document.querySelectorAll("#accountForm input:not([type='file'])");
    const container = document.querySelector(".glow-container");
    const submitButton = document.getElementById("submitButton");
    const accountForm = document.getElementById("accountForm"); // Ensure form is selected

    generateGlowBalls(container);

    if (!submitButton) {
        console.error("Submit button not found!");
        return;
    }

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
        formData.append("name", document.getElementById("name").value);
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
        ToggleDisable(allFilled);
    }

    function ToggleDisable(isValid) {
        if (submitButton) {
            submitButton.disabled = !isValid;
            submitButton.style.opacity = isValid ? "1" : "0.5";
        }
    }

    function showValidationErrors(errors) {
        let reviewText = "";
        let hasErrors = false;
        console.log(errors);
        ["name", "username", "password"].forEach(field => {
            const input = document.getElementById(field);
            if (errors[field]) {
                input.style.borderColor = "red";
                reviewText += `<strong>${field.replace(/([A-Z])/g, ' $1').trim()}:</strong> <span style='color:red;'>${errors[field]}</span><br>`;
                hasErrors = true;
            } else {
                input.style.borderColor = ""; // Reset border if no error
            }
        });

        if (hasErrors) {
            document.getElementById("reviewData").innerHTML = reviewText;
            currentStep = steps.length - 1; // Go to the last step
            steps.forEach(step => step.classList.remove("active"));
            steps[currentStep].classList.add("active");
            progressBar.style.width = "100%";
        }
    }

    function saveToLocalStorage() {
        const userData = {
            name: document.getElementById("name").value,
            username: document.getElementById("username").value,
            profilePic: document.getElementById("profileImage").src || null
        };
        localStorage.setItem("userData", JSON.stringify(userData));
    }

    async function SubmitAccount() {
    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("username", document.getElementById("username").value);
    formData.append("password", document.getElementById("password").value);

    const profilePic = document.getElementById("profilePic").files[0];
    if (profilePic) {
        formData.append("profilePic", profilePic);
    }

    try {
        const response = await axios.post("/create_account", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.feedback) {
            alert("Account created successfully!");
            window.location.href = "/dashboard";
        } else if(response.data.validation_errors) {
            showValidationErrors(response.data.validation_errors);
        }else if(response.data.feedback == false){
          alert("A user with that username exists already!")
        }
    } catch (error) {
        console.error("Submission error:", error);
        alert("An error occurred while creating the account.");
    }
}


    function loadFromLocalStorage() {
        const savedData = JSON.parse(localStorage.getItem("userData"));
        if (savedData) {
            document.getElementById("name").value = savedData.lastName || "";
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
            turnFractionColor(newColor, fr);

            if (currentStep === steps.length - 1) {
                const formData = collectFormData();
                let reviewText = "";

                ["name", "username"].forEach(field => {
                    const value = formData.get(field);
                    reviewText += `<strong>${field.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${value || "<span style='color:red;'>Required</span>"}<br>`;
                });

                document.getElementById("reviewData").innerHTML = reviewText;
                validateForm();
            }
        }
    };

    window.prevStep = function (fr_) {
        if (currentStep > 0) {
            revertFractionColor(originalColor, fr_);
            steps[currentStep].classList.remove("active");
            currentStep--;
            steps[currentStep].classList.add("active");
            progressBar.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;
        }
    };

    loadFromLocalStorage();

    // ✅ Attach event listener to the FORM instead of button
    accountForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        saveToLocalStorage();
        await SubmitAccount();
    });

    // ✅ Attach input event to form fields
    formInputs.forEach(input => input.addEventListener("input", validateForm));
}

InitCreateAccountPage();

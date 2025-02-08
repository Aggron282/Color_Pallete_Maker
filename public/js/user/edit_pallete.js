function InitDetailEditor() {

    const elements = {
        palleteEditForm: document.querySelector("#edit-pallete"),
        palleteImageUploadInput: document.querySelector(".pallete_input--file"),
        palleteImgContainer: document.querySelector(".edit_img_container"),
        palleteEditButton: document.querySelector("#pallete-edit-btn"),
        palleteToggleEdit: document.querySelector(".edit_pallete_btn"),
        palleteToggleDisplay: document.querySelector(".display_pallete_btn"),
        editContainer: document.querySelector(".edit_container"),
        displayContainer: document.querySelector(".detail_container"),
        colorListContainer: document.querySelector(".c--container"),
        originalBtn: document.querySelector(".detail_btn--original"),
        complementaryBtn: document.querySelector(".detail_btn--complementary"),
    };

    elements.palleteImageUploadInput.addEventListener("change", () => {
        InstantImageUpload(elements.palleteImageUploadInput, elements.palleteImgContainer);
    });

    elements.palleteEditForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        submitEdit();
    });

    elements.palleteEditButton.addEventListener("click", async (e) => {
        e.preventDefault();
        submitEdit();
    });

    elements.palleteToggleEdit.addEventListener("click", () => toggleDisplays(true));
    elements.palleteToggleDisplay.addEventListener("click", () => toggleDisplays(false));

    toggleDisplays(false);

    [0, 1].forEach(type => {
        renderColorsToDetail(type, false);
        renderColorsToDetail(type, true);
    });

    elements.originalBtn.addEventListener("click", (e) => {
        renderColorsToDetail(0, false);
        renderColorsToDetail(0, true);
        highlightDetailMenuChoice(e);
    });

    elements.complementaryBtn.addEventListener("click", (e) => {
        renderColorsToDetail(1, false);
        renderColorsToDetail(1, true);
        highlightDetailMenuChoice(e);
    });

    function toggleDisplays(isEditingOn) {
        elements.editContainer.classList.toggle("edit_container--active", isEditingOn);
        elements.displayContainer.classList.toggle("detail_container--active", !isEditingOn);
        elements.colorListContainer.classList.toggle("c--container--active", !isEditingOn);
    }

    async function submitEdit() {

        const newForm = new FormData(elements.palleteEditForm);

        try {

            const { data } = await axios.post("/user/pallete/edit", newForm);

            if (data.feedback) {
                CreatePopup(data.msg, "success");
                await Delay(1000);
                window.location.assign("/dashboard");
            }
            else if (data.msg) {
                CreatePopup(data.msg, "error");
            }
        }
        catch (error) {
          CreatePopup("An error occurred", "error");
          console.error(error);
        }

    }

    function highlightDetailMenuChoice(e) {

        document.querySelectorAll(".detail_btn").forEach(btn => btn.classList.remove("detail_btn--active"));

        if (e) {
          e.target.classList.add("detail_btn--active")
        }
    }

    async function renderColorsToDetail(type, isCustom) {

        const class_ = isCustom ? "custom_rgb_detail_container" : "rgb_detail_container";
        const container = document.querySelector("." + class_);
        const palleteId = elements.editContainer.getAttribute("pallete_id");
        const newColors = type <= 0 ? await GetOriginalColors(palleteId, isCustom) : await GetComplementaryColors(palleteId, isCustom);

        container.innerHTML = "";

        RenderColorPallete(container,newColors)

    }

}

InitDetailEditor();

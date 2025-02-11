let type_form = "color";

function InitColorConversionFeature(form_converter, form_button_converter) {
  console.log(form_converter,form_button_converter)
    if (!form_converter || !form_button_converter) return;

    form_converter.addEventListener("submit", (e) => {
        e.preventDefault();
        SubmitConversion(e);
    });

    form_button_converter.addEventListener("click", (e) => {
        e.preventDefault();
        SubmitConversion(e);
    });

}

function InitColorPicker() {
    const type_converter_container = document.querySelector(".type_converter_container");
    const form_converter = document.querySelector(".convert--form");
    const type_to_convert = document.querySelector(".type_conversion");
    const form_button_converter = document.querySelector(".submit-button--converter");
    const type_boxes = type_converter_container.querySelectorAll(".type-box")

    console.log(type_boxes)

    if (!type_converter_container || !form_converter || !type_to_convert) return;

    type_boxes.forEach((box) => {
        box.addEventListener("click", function (e) {
            e.stopPropagation();
            const type = e.target.dataset.type?.toLowerCase();
            if (!type) return;

            TurnOffActiveColorType();
            e.target.classList.add("type-box--active");

            type_form = ["rgb", "hsl", "hex"].includes(type) ? "color" : "filter";
            console.log(type_form)
            type_to_convert.value = type;
        });

    });

    // Event listener for form submission
    form_converter.addEventListener("submit", (e) => {
        e.preventDefault();
        SubmitConversion();
    });

    if (form_button_converter) {
        form_button_converter.addEventListener("click", (e) => {
            e.preventDefault();
            SubmitConversion();
        });
    }
}

async function SubmitConversion() {
    const form = new FormData(document.querySelector(".convert--form"));
    const root = "/convert/";
    const tri_container = document.querySelector(".color-grid--tri");
    const comp_container = document.querySelector(".color-grid--comp");
    RenderLoaderPalleteBoxes(tri_container,5)
    RenderLoaderPalleteBoxes(comp_container,5)
    try {
        const { data } = await axios.post(root + type_form, form);
        const converted_color = data.color;

        if (!converted_color) return;

        PopulateConversion(converted_color);

        const [comp, tri, rec] = await Promise.all([
            Recommend("comp", converted_color),
            Recommend("tri", converted_color),
            Recommend("rec", converted_color),
        ]);

        RenderColorPallete(tri_container, tri);
        RenderColorPallete(comp_container, comp);

    }
    catch (error) {
        console.error("Error submitting conversion:", error);
    }
}

function PopulateConversion(converted_color) {

    const circle_color = document.querySelector(".circle-color");
    const color_answer_main = document.querySelector(".color-answer--main");

    if (circle_color) circle_color.style.background = converted_color;
    if (color_answer_main) color_answer_main.innerHTML = converted_color;

}

function TurnOffActiveColorType() {

    document.querySelectorAll(".type-box--active").forEach((box) =>
        box.classList.remove("type-box--active")
    );

}

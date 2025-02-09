function InitHomepage() {

    const img_upload_form = document.querySelector(".img_upload_form");
    const img_upload_button = document.querySelector(".img_upload_button");
    const extraction_grid = document.querySelector(".extraction-grid");
    const img_display_container =document.querySelector(".img_display_continer");
    const form_converter = document.querySelector(".convert--form");
    const form_button_converter = document.querySelector(".submit-button--converter");

    InitImageUploadFeature(img_upload_form, img_upload_button, extraction_grid,img_display_container);
    InitColorConversionFeature(form_converter, form_button_converter);

}

InitHomepage();
InitColorPicker();

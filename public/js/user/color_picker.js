var add_picker = document.querySelector("#add_picker");
var picker_submit = document.querySelector(".picker_submit");
var picker_form = document.querySelector("#picker_form");
var picker_container = document.querySelector(".content_container");

var picker_modal = document.querySelector(".color_picker_container");
var picker_wrapper = document.querySelector(".color_picker_wrapper");
var picker_modal_btn = document.querySelector(".detail_btn--add");
var picker_exit = document.querySelector("#picker_exit");
var custom_color_container = document.querySelector(".custom_rgb_detail_container");

var counter = 1;

function ReturnColorPickerHTML(name){
   
    return(
    ` <input class="picker_input" name = "color_${name}" type="color" />`
    )

}

add_picker.addEventListener("click",(e)=>{
    picker_container.innerHTML += ReturnColorPickerHTML(counter);
    counter++;
});

picker_exit.addEventListener("click",(e)=>{

   TogglePickerModal(false)
});

picker_modal_btn.addEventListener("click",(e)=>{
   
    TogglePickerModal(true)
});

picker_form.addEventListener("submit",(e)=>{
    e.preventDefault();
});

picker_submit.addEventListener("click",async (e)=>{
   
    e.preventDefault();

    var colors = CreateArrayData(picker_form);
    var id = document.querySelector(`.color_picker_container`).getAttribute("pallete_id");
 
    var post_data = {
        colors:colors,
        pallete_id:id
    }

    var {data} = await axios.post("/user/color/add",post_data);
    
    if(data.feedback){
        CreatePopup(data.msg);
        window.location.assign(window.location.href);
    }
    else{
        CreatePopup(data.msg);
    }
    
    TogglePickerModal(false);

});

function TogglePickerModal(isOn){
    
    if(!isOn){
        picker_wrapper.classList.remove("color_picker_wrapper--active")
        picker_modal.classList.remove("color_picker_container--active")
    }
    else{
        picker_wrapper.classList.add("color_picker_wrapper--active")
        picker_modal.classList.add("color_picker_container--active")
    }

}



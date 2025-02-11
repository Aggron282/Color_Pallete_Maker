var pallete_id = getLastUrlSegment();
const text_container = document.querySelector(".ai_recommend_container");
const color_container = document.querySelector(".color-grid--recommend");


async function fetchPallete(){
  var color_container = document.querySelector(".color-grid--original");
  var name_container = document.querySelector(".pallete-title");
  // RenderLoaderAI(name_container);
  // RenderLoaderAI(color_container);
  var {data} = await axios.post('/user/pallete/single', { pallete_id:pallete_id });
  var pallete = data.pallete;
  var colorsArray = pallete.rgbList + " " + pallete.customRGBList;

  colorsArray = colorsArray.split(" ");
  name_container.innerHTML = "Name of Pallete: " + pallete.name;

  RenderColorPallete(color_container,colorsArray);

  console.log(colorsArray);

}

async function fetchPaletteAndSend() {

  RenderLoaderAI(text_container);
  RenderLoaderAI(color_container);
    try {

        const aiResponse = await axios.post('/ai/recommend/pallete', { pallete_id:pallete_id });

        const { recommendations, recommendations_colors } = aiResponse.data;
        console.log(recommendations,recommendations_colors)
        try{
          displayRecommendedPalettes(recommendations_colors,recommendations);
        }catch(error){
          console.log("Unable to make array");
          displayRecommendedPalettes([],recommendations);
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayRecommendedPalettes(palletes,html) {



    color_container.innerHTML = '';
    text_container.innerHTML = html;

    RenderColorPallete(color_container,palletes);

}

if(pallete_id != null){
  fetchPallete();
  fetchPaletteAndSend();
}
else{
  console.error("No pallete_id found");
}

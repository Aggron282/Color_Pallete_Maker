var path = require("path");
var rootDir = path.dirname(require.main.filename);
var color_util = require("./../util/colors.js");
const formidable = require('formidable');
const bcrypt = require("bcrypt")
const my_sequelize_util = require("./../util/my_sequelize.js");
const ai_util = require("./../util/ai.js");

const category_util = require("./../util/category_maker.js");
const {validationResult} = require("express-validator");

const AddPallete = async (req,res) => {

  var img_file = req.body.image;
  var colors = req.body.colors;
  var new_colors = null;
  var errors = validationResult(req);
  var appRoot = process.cwd()
  var rgbList;
  var newPath;
  var category = req.body.category  && req.body.category.length > 0 ? req.body.category : "";
  var name = req.body.name  && req.body.name.length > 0 ? req.body.name : "N/A";

  errors = errors.array();

  if(colors){

      new_colors = colors.split(",");

      var customRGBList = "";

      for(var i =0; i < new_colors.length;i++){

        customRGBList += color_util.ConvertFromHexToRGB(new_colors[i]);

        if(i < new_colors.length - 1){
          customRGBList += " "
        }

      }

  }
  if(!img_file && !new_colors ){
    res.json({feedback:false,msg:"File Empty"})
    return;
  }


    newPath = path.join(appRoot, 'images', path.basename(img_file));
    const color_data = await color_util.ExtractColorFromImage(newPath);

    rgbList = color_util.FromArrayToRGBList(color_data)
    console.log(rgbList,"S");
  var config=  {
    isViewable:false,
    name:name.toLowerCase(),
    user_id:req.user.user_id,
    image:newPath,
    customRGBList:customRGBList,
    category:category.toLowerCase(),
    rgbList:rgbList
  }

  if(errors.length > 0){
    res.json({feedback:false,msg:"Validation Error", validation_errors:errors})
    return;
  }

  my_sequelize_util.addPallete(config,((insert)=>{

    if(insert){
      res.json({feedback:true,msg:null})
    }
    else {
      res.json({feedback:false,msg:"Could not add pallete"})
    }

  }));

}

const GetUserPalletes = async (req,res)=>{

  my_sequelize_util.findUserPalletes(async (colors)=>{
    var palletes = await color_util.ConfigurePalletes(colors);
    res.json({palletes:palletes})
  })

}

const SearchPalletes = (req,res)=> {

  var search = req.body.search;
  var terms = search.split(";");
  var found_palletes = [];

  my_sequelize_util.findPalletesByArraySearch(req.user.user_id,terms,async(ps)=>{
    res.json({found_palletes:ps,term:search})
  })

}


const GetSinglePalleteData = async (req,res)=>{

  var pallete_id = req.body.pallete_id;

  my_sequelize_util.findOnePallete(req.user.user_id,pallete_id,async (pallete)=>{
    res.json({pallete:pallete})
  });

}

const AddCustomColorsToPallete = (req,res) => {

    var colors = req.body.colors;
    var pallete_id = req.body.pallete_id;
    var new_colors = "";

    for(var i =0; i < colors.length; i++){
      new_colors +=  color_util.hexToRgb(colors[i]) + " " ;
    }

    my_sequelize_util.findOnePallete(req.user.user_id,pallete_id, async (pallete)=>{

      if(!pallete){
        return res.json({feedback:false,msg:"Error Occurred"});
      }

      var new_pallete = {...pallete};
      var customRGBList = new_pallete.customRGBList != null ? new_pallete.customRGBList : "";

      customRGBList += " " + new_colors;

      new_pallete.customRGBList = customRGBList;

      my_sequelize_util.editPallete(req.user.user_id,pallete_id,new_pallete,async(r)=>{

        if(r){
          res.json({feedback:true,msg:"Added Custom Colors"});
        }else{
          res.json({feedback:false,msg:"Could Not Add Colors"});
        }

      });

    });

}


const EditPallete = (req,res)=>{

  var {name,category,pallete_id} = req.body
  var img_file = req.file;

  my_sequelize_util.findOnePallete(req.user.user_id,pallete_id,async (found_pallete)=>{

    var new_name = name.length > 0 ? name : found_pallete.name;
    var new_category = category ? category : "";

    new_category = new_category.length ? new_category : found_pallete.category;

    var src_file = req.file ? req.file.path : found_pallete.image;

    var color_data = null;
    var rgbList = null;

    if(src_file){
     color_data = await color_util.ExtractColorFromImage(src_file);
    }

    if(color_data){
     rgbList = color_util.FromArrayToRGBList(color_data)
    }

    var config = {
      name : new_name,
      category:new_category,
      image:src_file,
      rgbList:rgbList,
    }

    my_sequelize_util.editPallete(req.user.user_id,pallete_id,config,(data)=>{

      if(data){
        res.json({feedback:true,msg:"Edited Pallete"})
      }
      else{
        res.json({feedback:false,msg:"Could not Edit"})
      }

    });

  })

}

const GetOrganizedPalletes = (req,res) => {

    my_sequelize_util.findUserPalletes(req.user.user_id,async (colors)=>{

      var palletes = await color_util.ConfigurePalletes(colors);
      var organized_palletes = category_util.CreatePalleteCategories(palletes);
      res.json({organized_palletes:organized_palletes})

    });

}


const DeletePallete =  (req,res)=> {

  var pallete_id = req.body.pallete_id;
  var user_id = req.user.user_id;

  my_sequelize_util.deletePallete(user_id,pallete_id,(response)=>{

    if(response){
      res.json({feedback:true,msg:null})
    }
    else{
      res.json({feedback:false,msg:"Could not delete"})
    }

  })

}

const PalleteAIRecommendations = async (req, res) => {
    console.log("Request Body:", req.body);

    try {
        const { pallete_id } = req.body;

        // Fetch the palette from the database
        my_sequelize_util.findOnePallete(req.user.user_id, pallete_id, async (palette) => {
            if (!palette) {
                return res.status(404).json({ error: "Palette not found" });
            }

            console.log("Fetched Palette:", palette);

            // AI Prompt for HTML-based real-world application
            const stylePrompt = `
                Given the following color palette: ${palette}
                Suggest real-world applications for this palette, such as:
                - Interior design (living room, restaurant, office, etc.)
                - Business branding (corporate, luxury, casual, tech, etc.)
                - Web design themes (minimalist, vibrant, dark mode, etc.)
                - Fashion recommendations
                - Other practical real-world uses

                Provide the response strictly in the form of **HTML with inline styles**.
                Do not include <head> or <style> tags.
                Each suggestion should be enclosed in an element such as <div>, <h2>, <p>, etc., with **a brief explanation** of the application.
                - Make the html minimalist and look professional
                - DO NOT MAKE IT COLORFUL
                - Provide a score 1/10 of how good each color will be for each applications
                - Give a lot of detail and be honest if there not much info or its redundant then admit you do not have a recommendation or its not good etc
                - MAKE IT LOOK LIKE HOW YOU TEXT ON THE CHATGPT STYLE
                - Do not make it colorful make the text well structured and professional
                Example output format:
                <div style="background: none; color: white; padding: 15px; border-bottom:1px solid white">
                    <h2 style="color:white;">Modern Office Theme</h2>
                    <p style="color:white"> A detailed description of what can this pallete by used for and or if this pallete is a good choice or not</p>
                </div>

                Strictly return only the HTML elements.
            `;

            // AI Prompt for recommended additional colors
            const palettePrompt = `
                Based on the color palette: ${palette},
                suggest exactly 10 additional colors that complement this palette.
                The response should be **strictly an array of hex color codes**, formatted like this:
                ["#RRGGBB", "#RRGGBB", ...]
                Do not include any extra words, explanations, or formatting.
            `;

            try {

                const recommendations = await ai_util.AIMessage(stylePrompt);
                const recommendations_colors_raw = await ai_util.AIMessage(palettePrompt);

                let recommendations_colors;

                // try {
                //     recommendations_colors = JSON.parse(recommendations_colors_raw);
                //     if (!Array.isArray(recommendations_colors)) {
                //         throw new Error("AI did not return a valid array of colors");
                //     }
                // } catch (jsonError) {
                //     console.error("AI returned invalid JSON for colors:", jsonError);
                //     recommendations_colors = [];
                // }
                console.log( recommendations, recommendations_colors_raw)
                res.send({ recommendations:recommendations, recommendations_colors:recommendations_colors_raw });

            } catch (aiError) {
                console.error("AI Processing Error:", aiError);
                res.status(500).json({ error: "AI processing failed" });
            }

        });

    } catch (error) {
        console.error("Unexpected Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports.PalleteAIRecommendations = PalleteAIRecommendations;
module.exports.EditPallete = EditPallete;
module.exports.DeletePallete = DeletePallete;
module.exports.AddPallete = AddPallete;
module.exports.GetUserPalletes = GetUserPalletes;
module.exports.GetOrganizedPalletes = GetOrganizedPalletes;
module.exports.SearchPalletes =SearchPalletes;
module.exports.AddCustomColorsToPallete = AddCustomColorsToPallete;
module.exports.GetSinglePalleteData = GetSinglePalleteData;

var path = require("path");
var rootDir = path.dirname(require.main.filename);
var color_util = require("./../util/colors.js");

const GetMainPage = (req,res) => {
  res.render(path.join(rootDir,"views","index.ejs"));
}

const PostExtractColor = async (req,res) => {

  var img = req.file;
  var dirname = "/images/"
  var src = "";
  var image_name = "";

  if(img.file){
    image_name = img.file.filename;
    src = dirname + image_name;
  }

  const color_data = await color_util.ExtractColorFromImage(src);
  res.json({colors:color_data});

}

module.exports.GetMainPage = GetMainPage;
module.exports.PostExtractColor = PostExtractColor;

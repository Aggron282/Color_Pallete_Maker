var { extractColors } = require("extract-colors");

 const ExtractColorFromImage = async (src) => {

    const colors = await extractColors(src);
    return colors;
}

module.exports.ExtractColorFromImage  = ExtractColorFromImage;

const path = require("path");

exports.uploadImage = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "images", req.file.filename);

    // Attempt to process the image
    const pixels = await processImage(filePath);

    // If successful, proceed with your logic
    res.status(200).json({
      success: true,
      message: "Image processed successfully!",
      data: pixels,
    });
  } catch (error) {
    // Gracefully handle errors
    res.status(400).json({
      success: false,
      message: error.message || "An error occurred while processing the image.",
    });
  }
};

const express = require("express");
const colorController = require("./../controllers/color_controller.js"); // Update the path to your controller file
const router = express.Router();

router.post("/convert/color", colorController.ConvertColor);
router.post("/convert/filter", colorController.ConvertFilter);
router.post("/colors/complementary", colorController.GetComplementaryColors);
router.post("/colors/primary", colorController.GetPrimaryColors);
router.post("/colors/triad", colorController.GetTriadColors);
router.post("/extract", colorController.PostExtractColor);
router.post("/colors/original", colorController.GetOriginalColors);
router.post("/ai/recommend", colorController.GetRecommendedPallete);

module.exports = router;

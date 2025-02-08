const express = require("express");
const { body } = require("express-validator");
const palleteController = require("./../controllers/pallete_controller");
const router = express.Router();

// Validation middleware for adding a palette
const validateAddPallete = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isString()
    .withMessage("Name must be a string."),
  body("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isString()
    .withMessage("Category must be a string."),
  body("colors")
    .optional()
    .isString()
    .withMessage("Colors must be a comma-separated string."),
  body("image")
    .notEmpty()
    .withMessage("Image is required.")
    .isString()
    .withMessage("Image path must be a string."),
];

// Define routes and connect them to controller functions
router.post("/search", palleteController.SearchPalletes);
router.post("/user/pallete/single", palleteController.GetSinglePalleteData);
router.post("/add-colors", palleteController.AddCustomColorsToPallete);
router.post("/user/pallete/edit", palleteController.EditPallete);
router.get("/user/palletes/organized", palleteController.GetOrganizedPalletes);
router.get("/user-palletes", palleteController.GetUserPalletes);
router.delete("/delete", palleteController.DeletePallete);

router.post("/save", validateAddPallete, palleteController.AddPallete);

module.exports = router;

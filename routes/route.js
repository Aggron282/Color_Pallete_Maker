var router = require("express").Router();
var controller = require("./../controllers/controller.js");
var {body,check} = require("express-validator");
var isAuth = require("./../middleware/isAuth.js");

// Routes for pages
router.get("/", controller.GetMainPage); // Main page
router.get("/dashboard", controller.GetDashboardPage); // Dashboard page
router.get("/profile", controller.GetProfilePage); // Profile page
router.get("/add", controller.GetAddPage); // Add new palette page
router.get("/category/:category", controller.GetAllInCategoryPage); // Palettes in category
router.get("/detail/:pallete", controller.GetPalleteDetailPage); // Palette details
router.get("/login", controller.GetLoginPage); // Login page
router.get("/create-account", controller.GetCreateAccountPage); // Create account page

module.exports = router;

module.exports = router;

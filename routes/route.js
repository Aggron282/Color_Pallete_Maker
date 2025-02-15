var router = require("express").Router();
var controller = require("./../controllers/controller.js");
var {body,check} = require("express-validator");
var isAuth = require("./../middleware/isAuth.js");

router.get("/", controller.GetMainPage); // Main page
router.get("/particle_maker", controller.GetParticleMakerPage); // Profile page
router.get("/converter", controller.GetConverterPage); // Convrter page
router.get("/dashboard", controller.GetDashboardPage); // Dashboard page
router.get("/profile", controller.GetProfilePage); // Profile page
router.get("/add", controller.GetAddPage); // Add new palette page
router.get("/category/:category", controller.GetAllInCategoryPage); // Palettes in category
router.get("/detail/:pallete", controller.GetPalleteDetailPage); // Palette details
router.get("/login", controller.GetLoginPage); // Login page
router.get("/create_account", controller.GetCreateAccountPage); // Create account page
router.get("/ai/:pallete_id", controller.GetAIPage); // ai recommend page

module.exports = router;

module.exports = router;

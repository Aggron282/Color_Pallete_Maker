var router = require("express").Router();
var controller = require("./../controllers/controller.js");
var {body,check} = require("express-validator");
var isAuth = require("./../middleware/isAuth.js");
router.get("/",controller.GetMainPage);
router.get("/profile",isAuth,controller.GetProfilePage);
router.get("/login",controller.GetLoginPage);
router.post("/profile/edit",isAuth,controller.EditUser);
router.get("/create_account",controller.GetCreateAccountPage);
router.post("/create_account",
    check("name").isLength({min:2}).withMessage("Name is too short"),
    check("username").isLength({min:6}).withMessage("Username must be at least 6 characters"),
    check("password").isLength({min:6}).withMessage("Password must contain at least 6 characters").matches(/[^a-zA-Z0-9]/)
    .withMessage("Password must contain at least one special character")
,controller.CreateAccount);
router.post("/login",controller.Login);
router.get("/logout",controller.Logout);
router.post("/delete/user/perm",isAuth,controller.DeleteUser);
router.get("/dashboard",isAuth,controller.GetDashboardPage);
router.get("/add",
isAuth,controller.GetAddPage);
router.post("/delete",isAuth,controller.DeletePallete);
router.post("/extract",controller.PostExtractColor);
router.post("/save",
check("name").isLength({min:1}).withMessage("Name is too short"),
isAuth,controller.AddPallete);
router.get("/user/palletes",isAuth,controller.GetUserPalletes);
router.get("/category/:category",isAuth,controller.GetAllInCategoryPage);
router.get("/pallete/:pallete",isAuth,controller.GetPalleteDetailPage);
router.post("/pallete/edit/",isAuth,controller.EditPallete);
module.exports = router;

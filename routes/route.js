var router = require("express").Router();
var controller = require("./../controllers/controller.js");
var {body,check} = require("express-validator");
var isAuth = require("./../middleware/isAuth.js");
router.get("/",controller.GetMainPage);

router.get("/login",controller.GetLoginPage);
router.get("/create_account",controller.GetCreateAccountPage);
router.post("/create_account",
    check("name").isLength({min:2}).withMessage("Name is too short"),
    check("username").isLength({min:6}).withMessage("Username must be at least 6 characters"),
    check("password").isLength({min:6}).withMessage("Password must contain at least 6 characters").matches(/[^a-zA-Z0-9]/)
    .withMessage("Password must contain at least one special character")
,controller.CreateAccount);
router.post("/login",controller.Login);
router.get("/dashboard",isAuth,controller.GetDashboardPage);
router.get("/add",isAuth,controller.GetAddPage);
router.post("/extract",controller.PostExtractColor);
router.post("/save",controller.AddPallete);
router.get("/user/pallets",controller.GetUserPallets);


module.exports = router;

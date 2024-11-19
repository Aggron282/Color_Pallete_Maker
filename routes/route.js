var router = require("express").Router();
var controller = require("./../controllers/controller.js");

router.get("/",controller.GetMainPage);

router.get("/login",controller.GetLoginPage);
router.get("/create_account",controller.GetCreateAccountPage);
router.post("/create_account",controller.CreateAccount);

router.post("/extract",controller.PostExtractColor);


module.exports = router;

var router = require("express").Router();
var controller = require("./../controllers/controller.js");

router.get("/",controller.GetMainPage);


module.exports = router;

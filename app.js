var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var multer = require("multer");
var routes = require("./routes/route.js");
var port = 3000;
var app = express();
var db = require("./util/db.js");

db.execute(`SELECT * from user`).then((r)=>{
  console.log(r);
}).catch((err)=>{
  console.log(err);
});

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(routes);

app.listen(port,()=>{
  console.log("app listening");
})

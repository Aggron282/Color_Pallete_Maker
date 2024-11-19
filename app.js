var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var multer = require("multer");
var routes = require("./routes/route.js");
var rootDir = path.dirname(require.main.filename);
var port = 3000;
var app = express();

var storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,path.join(rootDir,"images/"))
  },
  filename: (req,file,cb) => {
    cb(null,new Date().toISOString().replace(/:/g, '-')+"-"+file.originalname)
  }
})


app.set("view engine","ejs");

app.use(multer({dest:"images",storage}).single("image"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("images"));

app.use(express.static("public"));

app.use(routes);

app.listen(port,()=>{
  console.log("app listening");
})

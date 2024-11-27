var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var multer = require("multer");
var routes = require("./routes/route.js");
var rootDir = path.dirname(require.main.filename);
var port = 3000;
var app = express();
var session = require("express-session");
const image_handler = require("./util/image_handler.js");
var sequelize = require("sequelize");
var sequelize_connection = require("./util/sequelize_connection.js")

app.use(express.static("images"));

app.use(session({
  resave:true,
  saveUninitialized:false,
  secret:"39iri3290ie3r2ir3209jdfiewcmod12",
  cookie:{
    secure:false,
    expires: new Date(Date.now() + 18900000),
    maxAge: 1800 * 60 * 1000
  }
}))

app.use((req,res,next)=>{

  if(req.session.user){
    req.user = req.session.user;
  }else{
    req.user = null
  }
  next();

})

var storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,path.join(rootDir,"images"))
  },
  filename: (req,file,cb) => {
    cb(null,new Date().toISOString().replace(/:/g, '-')+"-"+file.originalname)
  }
})


app.set("view engine","ejs");

app.use(multer({storage:storage,fileFilter: function(req,file, cb) {
    image_handler.checkFileType(file, cb);
}}).single("image"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.json());

app.use(express.static("public"));

app.use(routes);

sequelize_connection.sync().then(()=>{
  app.listen(port,()=>{
    console.log("app listening");
  })
})

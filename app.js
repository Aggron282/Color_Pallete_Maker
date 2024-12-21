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

cookieParser = require('cookie-parser'), // cookie middleware
MySQLStore = require('connect-mysql')(session), // mysql session store
options = {
  config: {
    user: 'root',
    password: 'Linoone99!',
    database: 'colors'
  }
},
app = express();

app.use(cookieParser());

app.use(session({
secret: 'keyboardcreojnv aecat',
resave: false,
saveUninitialized: true,
cookie: {
httpOnly: false,
secure: false,
maxAge: 1000 * 60 * 60 * 24 * 3,
expires: 1000 * 60 * 60 * 24 * 3
},
store: new MySQLStore(options) // Change the express session store
}));

// const StoreSession =  new MongoDBStore({
//   uri:"mongodb+srv://marcokhodr116:Ninjask12345!@cluster0.f0de6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
//   collection:"session"
// });

app.use(express.static("images"));

// app.use(session({
//   resave:false,
//   saveUninitialized:false,
//   secret:"39iri3290ie3r2ir3209jdfiewcmod12",
//   cookie:{
//     secure:false,
//     expires: new Date(Date.now() + 18900000),
//     maxAge: 1800 * 60 * 1000
//   }
// }))

// app.use(session({secret:"43489438994388948949842894389",saveUninitialized:false,store:StoreSession}));


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

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const color_routes = require("./routes/color_routes.js");
const pallete_routes = require("./routes/pallete_routes.js");
const user_routes = require("./routes/user_routes.js");
const routes = require("./routes/route.js");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const MySQLStore = require("connect-mysql")(session);
const image_handler = require("./util/image_handler.js");
const sequelize_connection = require("./util/sequelize_connection.js");

// Port and app initialization
const port = 3000;
const app = express();

require('dotenv').config();
const mysql = require('mysql2');

// Check if running locally or in a deployed environment
const isLocal = process.env.NODE_ENV !== 'production';

var options = {
  config:{
    host: isLocal ? process.env.LOCAL_DB_HOST: process.env.DB_HOST,
    user: isLocal ? process.env.LOCAL_DB_USER : process.env.DB_USER,
    password: isLocal ? process.env.LOCAL_DB_PASSWORD : process.env.DB_PASSWORD,
    database: isLocal ? process.env.LOCAL_DB_NAME : process.env.DB_NAME,
    port: isLocal ? process.env.DB_PORT : process.env.DB_PORT
  }
}


// Configure session middleware
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore(options),
    cookie: {
      httpOnly: true,
      secure: !isLocal, // Secure cookies only in production
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    },
  })
);

// Set static file directory
app.use(express.static("images"));

// Add user data to request object if session exists
app.use((req, res, next) => {
  req.user = req.session.user || null;
  next();
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images")); // Use __dirname for cleaner rootDir management
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

app.use(
  multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      image_handler.checkFileType(file, cb);
    },
  }).single("image")
);

// Configure body-parser and JSON middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Set static directory for public files
app.use(express.static("public"));

// Set view engine to EJS
app.set("view engine", "ejs");

// Use application routes
app.use(color_routes);
app.use(pallete_routes);
app.use(user_routes);
app.use(routes);

// Start the Sequelize connection and server
sequelize_connection.sync().then(() => {
  app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
  });
});

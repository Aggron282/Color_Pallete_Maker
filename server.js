require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MySQLStore = require("connect-mysql")(session);
const mysql = require("mysql2");

// Import utility files and routes
const image_handler = require("./util/image_handler.js");
const sequelize_connection = require("./util/sequelize_connection.js");
const color_routes = require("./routes/color_routes.js");
const pallete_routes = require("./routes/pallete_routes.js");
const user_routes = require("./routes/user_routes.js");
const routes = require("./routes/route.js");

// Port and app initialization
const port = 3000;
const app = express();

// Check if running locally or in production
const isLocal = process.env.NODE_ENV !== "production";

// MySQL Database Configuration
const options = {
  config: {
    host: isLocal ? process.env.LOCAL_DB_HOST : process.env.DB_HOST,
    user: isLocal ? process.env.LOCAL_DB_USER : process.env.DB_USER,
    password: isLocal ? process.env.LOCAL_DB_PASSWORD : process.env.DB_PASSWORD,
    database: isLocal ? process.env.LOCAL_DB_NAME : process.env.DB_NAME,
    port: isLocal ? process.env.LOCAL_DB_PORT : process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
};

// Initialize MySQL Session Store
const sessionStore = new MySQLStore(options);

// Configure session middleware
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false, // ✅ Ensures sessions are only saved when modified
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: !isLocal, // ✅ Secure in production
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    },
  })
);

// Middleware to attach user session data to the request
app.use((req, res, next) => {
  req.user = req.session.user || null;
  next();
});

// Set static file directories
app.use(express.static("images"));
app.use(express.static("public"));

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
    console.log(`✅ App is listening on port ${port}`);
  });
});

require('dotenv').config();
const mysql = require("mysql2");

// Create initial connection (without database)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  multipleStatements: true // ✅ Allows multiple queries at once
});

console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// ✅ Ensure database exists
connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`, (err) => {
  if (err) {
    console.error("❌ Error creating database:", err);
    return;
  }
  console.log(`✅ Database '${process.env.DB_NAME}' exists or was created.`);

  // ✅ Now connect to the specific database
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  db.connect((err) => {
    if (err) {
      console.error("❌ MySQL Connection Failed:", err);
    } else {
      console.log("✅ MySQL Connected Successfully to database:", process.env.DB_NAME);
      createUsersTable(db); // ✅ Create users table
      // createPalettesTable(db); // ✅ Create palettes table
      showTables(db); // ✅ Show tables after creation
    }
  });
});

// ✅ Function to Create `users` Table
function createUsersTable(db) {
  const sql = `
  DROP TABLE IF EXISTS palettes, palletes, users;


  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error creating `users` table:", err);
    } else {
      console.log("✅ `users` table exists or was created.");
    }
  });
}

// ✅ Function to Create `palettes` Table
function createPalettesTable(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS palettes (
      palette_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      colors TEXT NOT NULL,  -- Stores JSON or comma-separated colors
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error creating `palettes` table:", err);
    } else {
      console.log("✅ `palettes` table exists or was created.");
    }
  });
}

// ✅ Function to Show All Tables in the Database
function showTables(db) {
  db.query("SHOW TABLES;", (err, results) => {
    if (err) {
      console.error("❌ Error fetching tables:", err);
    } else {
      console.log("✅ Tables in Database:", results);
    }
  });
}

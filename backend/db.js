// pop-market/backend/db.js
require('dotenv').config();
const mysql = require('mysql2');

const isAWS = process.env.USE_AWS === "true"; // Switch between AWS and Local

// Create a connection pool (callback style)
const pool = mysql.createPool({
  host: isAWS ? process.env.AWS_DB_HOST : process.env.DB_HOST,
  user: isAWS ? process.env.AWS_DB_USER : process.env.DB_USER,
  password: isAWS ? process.env.AWS_DB_PASS : process.env.DB_PASS,
  database: isAWS ? process.env.AWS_DB_NAME : process.env.DB_NAME,
  port: isAWS ? process.env.AWS_DB_PORT : process.env.DB_PORT, // ✅ Add port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Optionally handle any pool-level errors
pool.on('error', err => {
  console.error('MySQL pool error', err);
});

// Export a promise-based pool for async/await if desired
module.exports = pool.promise();
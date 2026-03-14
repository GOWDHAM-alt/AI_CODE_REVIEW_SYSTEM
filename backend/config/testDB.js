const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const requiredKeys = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missingKeys = requiredKeys.filter((k) => !process.env[k]);
if (missingKeys.length) {
  throw new Error(`Missing required env vars: ${missingKeys.join(', ')}`);
}

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,  // ✅ add this for Railway
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('MySQL connected successfully!');
    connection.release();
  }
});

module.exports = db.promise();
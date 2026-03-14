const db = require('../config/testDB');

// Save new user to database
const createUser = async (username, email, hashedPassword) => {
  const [result] = await db.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );
  return result;
};

// Find user by email (for login)
const findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0]; // return first match
};

module.exports = { createUser, findUserByEmail };
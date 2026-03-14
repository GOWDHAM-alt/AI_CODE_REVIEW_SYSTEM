const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

// Generate JWT token
function generateToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1d' });
}

// REGISTER
const register = async (req, res) => {
  console.log('=== REGISTER HIT ===');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', req.body);

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({
          message: 'Email is already registered. But the password is incorrect.'
        });
      }

      const token = generateToken(existingUser);
      return res.json({
        message: 'Account already exists. Logged in successfully.',
        token,
        user: { id: existingUser.id, username: existingUser.username, email: existingUser.email }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(username, email, hashedPassword);

    const createdUser = await findUserByEmail(email);
    const token = generateToken(createdUser);
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: createdUser.id, username: createdUser.username, email: createdUser.email }
    });

  } catch (error) {
    const message = error?.message === 'JWT_SECRET is not set'
      ? error.message
      : 'Internal server error';
    return res.status(500).json({ message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    return res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });

  } catch (error) {
    const message = error?.message === 'JWT_SECRET is not set'
      ? error.message
      : 'Internal server error';
    return res.status(500).json({ message });
  }
};

// ✅ THIS LINE IS CRITICAL — exports both functions
module.exports = { register, login };
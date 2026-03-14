const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // 1. Get token from request header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, access denied' });
    }

    // 2. Extract token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to request
    req.user = decoded;

    next(); // move to next function (the actual route)

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = protect;
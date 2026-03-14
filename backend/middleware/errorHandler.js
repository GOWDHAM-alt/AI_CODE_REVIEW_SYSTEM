const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ message: 'Email already exists' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired, please login again' });
  }

  // Default error
  res.status(500).json({ 
    message: 'Something went wrong',
    error: err.message 
  });
};

module.exports = errorHandler;
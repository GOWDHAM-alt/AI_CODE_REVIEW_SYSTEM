const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [   
   ' http://localhost:5173/',
    'https://your-app.vercel.app'      // production (update after Vercel deploy)
  ],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

require('./config/testDB');

const authRoutes = require('./Routes/authRoutes');
const codeRoutes = require('./Routes/codeRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);
app.use(errorHandler);   // ✅ must be last

app.get('/', (req, res) => {
  res.json({ message: 'AI Code Reviewer API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

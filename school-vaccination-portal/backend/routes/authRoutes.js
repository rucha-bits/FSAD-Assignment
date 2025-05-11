const express = require('express');
const router = express.Router();

// Simulated login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Dummy credentials for simulation
  if (username === 'admin' && password === 'admin123') {
    // Create a simulated token and user data
    const token = 'fake-jwt-token';
    const user = { username: 'admin', name: 'Admin' };

    return res.json({ token, user });
  }

  // If credentials are wrong
  return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;

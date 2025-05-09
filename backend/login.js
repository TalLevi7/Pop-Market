const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db'); // MySQL connection

// Login Route Handler
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if user exists
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    // Debugging: Log the retrieved user object
    console.log('Retrieved user:', user);

    if (user.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if password_hash field is available
    if (!user[0].password_hash) {
      return res.status(500).json({ error: 'Password hash not found in database' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user[0].id, email: user[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token back to the client
    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { login };

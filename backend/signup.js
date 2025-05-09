const bcrypt = require('bcryptjs');
const db = require('./db');

// Signup Route Handler
const signup = async (req, res) => {
  const { username, email, password, phone_number } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if the email already exists
  try {
    const [existingEmail] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const [existingUsername] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    if (existingUsername.length > 0) {
      return res.status(400).json({ error: 'Username already in use' });
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const query = 'INSERT INTO users (username, email, password_hash, phone_number) VALUES (?, ?, ?, ?)';
    await db.query(query, [username, email, hashedPassword, phone_number || null]);

    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = { signup };

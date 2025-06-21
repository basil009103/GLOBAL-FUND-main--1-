const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User');  // Make sure the path and filename are correct

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

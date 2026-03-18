const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protectAdmin } = require('../middleware/auth');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// POST /api/admin/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, address, location } = req.body;

    if (!name || !email || !password || !address || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const admin = await Admin.create({ name, email, password, address, location });
    const token = signToken(admin._id);
    const profile = { id: admin._id, name: admin.name, email: admin.email, location: admin.location };

    res.status(201).json({
      token,
      ngo: profile,
      admin: profile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ message: "Account doesn't exist" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = signToken(admin._id);
    const profile = { id: admin._id, name: admin.name, email: admin.email, location: admin.location };

    res.json({
      token,
      ngo: profile,
      admin: profile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/auth/me  (protected)
router.get('/me', protectAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

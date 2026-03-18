const express = require('express');
const jwt = require('jsonwebtoken');
const DeliveryPerson = require('../models/DeliveryPerson');
const { protectDelivery } = require('../middleware/auth');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id, role: 'delivery' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// POST /api/delivery/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    if (!name || !email || !password || !city) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await DeliveryPerson.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const person = await DeliveryPerson.create({ name, email, password, city });
    const token = signToken(person._id);

    res.status(201).json({
      token,
      person: { id: person._id, name: person.name, email: person.email, city: person.city },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/delivery/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const person = await DeliveryPerson.findOne({ email: email.toLowerCase() });
    if (!person) {
      return res.status(404).json({ message: "Account doesn't exist" });
    }

    const isMatch = await person.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = signToken(person._id);

    res.json({
      token,
      person: { id: person._id, name: person.name, email: person.email, city: person.city },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/delivery/auth/me  (protected)
router.get('/me', protectDelivery, async (req, res) => {
  try {
    const person = await DeliveryPerson.findById(req.user.id).select('-password');
    if (!person) return res.status(404).json({ message: 'Delivery person not found' });
    res.json(person);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

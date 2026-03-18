const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/adminAuth');
const deliveryAuthRoutes = require('./routes/deliveryAuth');
const donationRoutes = require('./routes/donations');
const ngoRoutes = require('./routes/ngos');
const feedbackRoutes = require('./routes/feedback');
const analyticsRoutes = require('./routes/analytics');
const notificationRoutes = require('./routes/notifications');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// NGO paths are now primary; admin paths are compatibility aliases.
app.use('/api/ngo/auth', adminAuthRoutes);
app.use('/api/admin/auth', adminAuthRoutes);

app.use('/api/delivery/auth', deliveryAuthRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = app;

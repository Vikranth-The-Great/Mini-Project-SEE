const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // Legacy donor field; kept for backward compatibility.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    recipientRole: {
      type: String,
      enum: ['user', 'admin', 'delivery'],
      default: 'user',
      index: true,
    },
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodDonation', required: true },
    type: {
      type: String,
      enum: ['claimed', 'picked', 'delivered', 'donation-created', 'donation-claimed', 'delivery-accepted', 'info'],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);

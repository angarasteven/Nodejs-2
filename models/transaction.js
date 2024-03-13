// models/transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'transfer', 'earn'
  amount: { type: Number, required: true },
  targetUserId: String, // Optional, used for transfers
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
// models/item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  description: String,
  stock: { type: Number, default: 0 } // Quantity available for sale
});

module.exports = mongoose.model('Item', itemSchema);
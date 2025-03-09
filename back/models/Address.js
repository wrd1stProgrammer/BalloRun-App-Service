const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  detail: { type: String },
  postalCode: { type: String },
  addressType: { type: String, enum: ['home', 'work', 'other'], required: true },
  riderNote: { type: String },
  entranceCode: { type: String },
  directions: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Address', AddressSchema);
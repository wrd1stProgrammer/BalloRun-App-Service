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
  createdAt: { type: Date, default: Date.now },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

AddressSchema.pre('save', async function (next) {
  const count = await mongoose.model('Address').countDocuments({ userId: this.userId });
  if (count >= 10) {
    const err = new Error('주소는 최대 10개까지만 등록할 수 있습니다.');
    err.name = 'AddressLimitError';
    return next(err);
  }
  next();
});

module.exports = mongoose.model('Address', AddressSchema);
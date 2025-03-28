// models/Report.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reason: { type: String, required: true },
  reportedUser: { type: String, required: true },
  chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  reportedAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', ReportSchema);
module.exports = Report;
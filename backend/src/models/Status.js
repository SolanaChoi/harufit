const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weight: { // 체중 (kg)
    type: Number,
    required: true,
  },
  bodyFatPercentage: { // 체지방률 (%)
    type: Number,
  },
  skeletalMuscleMass: { // 골격근량 (kg)
    type: Number,
  },
  notes: { // 메모
    type: String,
    trim: true,
  },
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

const Status = mongoose.model('Status', statusSchema);

module.exports = Status;
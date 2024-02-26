
const mongoose = require('mongoose');
const moment = require('moment');

const salesSchema = new mongoose.Schema({
  land: { type: mongoose.Schema.Types.ObjectId, ref: 'Land' },
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  timestamp: {
    type: String,
    default: () => moment().format('YYYY-MM-DD HH.mmA'),
  },
}, {
  timestamps: true,
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;

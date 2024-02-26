const mongoose = require('mongoose');
const moment = require('moment');

const landSchema = new mongoose.Schema({
  landType: { type: String, required: true },
  rentOrLease: { type: String, enum: ['Rent', 'Lease', 'Sale'], required: true },
  location: { type: String, required: true },
  landSize: { type: String, required: true },
  rentOrLeasePrice: { type: String, required: true },
  waterDetails: { type: String, required: true },
  electricityStatus: { type: String, enum: ['Available', 'Not Available'], required: true },
  otherDetails: { type: String, required: true },
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumbers: { type: String, required: true },
  OtherNumbers: { type: String, required: true },
    address: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Not Available'], default: 'Available' }, 
  ispost:{type:Boolean,default:false},
  timestamps: {
    type: String,
    default: () => moment().format('YYYY-MM-DD HH.mmA'),
 }
}, {
  timestamps: true 
});

const Land = mongoose.model('Lands', landSchema);

module.exports = Land;

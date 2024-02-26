const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
  paymentIntentId: { type: String, required: true },
  landno:{ type: String, required: true },
  amount: { type: Number, required: true },
  cardholderName: { type: String, required: true },
  status: { type: String, enum: ['paid', 'pending', 'failed'], required: true },
  InvoiceId: { type: Number, default: 1 }, 
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
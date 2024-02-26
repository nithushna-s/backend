const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Invoice = require('../models/Invoice');
const uuid = require('uuid');

const generateInvoiceId = () => {
  return uuid.v4();
};

const createPayment = async (req, res) => {
  try {
    const { paymentMethodId, cardholderName, paymentAmount, landno } = req.body; 

    const maxInvoice = await Invoice.findOne({}, {}, { sort: { InvoiceId: -1 } });
    let nextInvoiceId = 1;
    if (maxInvoice) {
      nextInvoiceId = maxInvoice.InvoiceId + 1;
    }

    const amountInCents = paymentAmount * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method: paymentMethodId,
      description: 'Payment for your land ad fee',
      confirm: true,
      return_url: `http://localhost:7100/api/bill/${nextInvoiceId}`,
    });

    const invoice = new Invoice({
      paymentIntentId: paymentIntent.id,
      landno: landno, 
      amount: paymentAmount,
      cardholderName: cardholderName,
      status: 'paid',
      InvoiceId: nextInvoiceId
    });

    await invoice.save();

    res.status(200).json({ message: 'Payment successful', paymentIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPayment };

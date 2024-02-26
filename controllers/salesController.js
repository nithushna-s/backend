const nodemailer = require('nodemailer');
const Land = require('../models/landModels');
const Sales = require('../models/Sales');

const submitSalesForm = async (req, res) => {
  try {
    const { name, address, email, phoneNumber } = req.body;
    const landId = req.params.id;

    const sales = new Sales({
      land: landId,
      name,
      address,
      email,
      phoneNumber,
    });

    await sales.save();

    // Optionally, update the sold status in the Land model
    await Land.findByIdAndUpdate(landId, { sold: true });

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: 'sivarasanithushna@gmail.com',
      to: email,
      subject: 'Land Sales Form Submission',
      text: `Name: ${name} - Success sending your request. Will be in contact soon`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Sales form submitted successfully' });
  } catch (error) {
    console.error('Error submitting sales form:', error);
    res.status(500).json({ error: 'Error submitting sales form' });
  }
};

const getAdminSalesDetails = async (req, res) => {
  try {
    const sales = await Sales.find();

    const salesDetails = await Promise.all(
      sales.map(async (sale) => {
        const land = await Land.findById(sale.land);
        return { ...sale._doc };
      })
    );

    res.status(200).json(salesDetails);
  } catch (error) {
    console.error('Error fetching sales details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  submitSalesForm,
  getAdminSalesDetails,
};

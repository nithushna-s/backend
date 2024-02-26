const nodemailer = require('nodemailer');
const Land = require('../models/landModels');
const Rental = require('../models/Rental');

const submitRentalForm = async (req, res) => {
  try {
    const { startDate, endDate, name, address, email, phoneNumber } = req.body;
    const landId = req.params.id;

    const rental = new Rental({
      land: landId,
      startDate,
      endDate,
      name,
      address,
      email,
      phoneNumber,
    });

    await rental.save();

    // Optionally, update the rented status in the Land model
    await Land.findByIdAndUpdate(landId, { rented: true });

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
      subject: 'Land Rental Form Submission',
      text: `Name: ${name} - Success sending your request. Will be in contact soon`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Rental form submitted successfully' });
  } catch (error) {
    console.error('Error submitting rental form:', error);
    res.status(500).json({ error: 'Error submitting rental form' });
  }
};

const getAdminRentalDetails = async (req, res) => {
  try {
    const rentals = await Rental.find();

    const rentalDetails = await Promise.all(
      rentals.map(async (rental) => {
        const land = await Land.findById(rental.land);
        return { ...rental._doc };
      })
    );

    res.status(200).json(rentalDetails);
  } catch (error) {
    console.error('Error fetching rental details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  submitRentalForm,
  getAdminRentalDetails,
};

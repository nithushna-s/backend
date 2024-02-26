const Land = require('../models/landModels');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const sendEmail = async (to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'sivarasanithushna@gmail.com',
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};

exports.createLand = async (req, res) => {
  try {
    const { image, ...landData } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'fieldlinker',
    });

    const land = new Land({
      ...landData,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    const savedLand = await land.save();
    const landId = savedLand._id;
    const emailMessage = `Thank you for submitting your land details. This is your land ID: ${landId}. Use this ID for your payment.`;
    await sendEmail(
      savedLand.email,
      'Land Submission Confirmation',
      emailMessage
    );

    res.status(201).json(savedLand);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


exports.getAllLands = async (req, res) => {
  try {
    const filters = req.query;
    const filterObject = { ispost:true }; 

    if (filters.landType) {
      filterObject.landType = filters.landType;
    }

    if (filters.rentOrLease) {
      filterObject.rentOrLease = filters.rentOrLease;
    }

    if (filters.location) {
      filterObject.location = filters.location;
    }

    const lands = await Land.find(filterObject);

    res.json(lands);
  } catch (error) {
    console.error('Error fetching lands:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFilterValues = async (req, res) => {
  try {
    const filterObject = { ispost: true }; 
    
    const cropTypes = await Land.distinct('landType', filterObject);
    const rentOrLeaseOptions = await Land.distinct('rentOrLease', filterObject);
    
    res.json({ cropTypes, rentOrLeaseOptions });
  } catch (error) {
    console.error('Error fetching filter values:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllLandsAdmin = async (req, res) => {
  try {
    const allLands = await Land.find();
    res.status(200).json(allLands);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getLandById = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }
    res.status(200).json(land);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateLandById = async (req, res) => {
  try {
    const updatedLand = await Land.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: req.file }, 
      { new: true }
    );

    if (!updatedLand) {
      return res.status(404).json({ message: 'Land not found' });
    }

    res.status(200).json(updatedLand);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.softDeleteLandById = async (req, res) => {
  try {
    const landId = req.params.id;

    const updatedLand = await Land.findByIdAndUpdate(
      landId,
      { ispost: false },
      { new: true }
    );

    if (!updatedLand) {
      return res.status(404).json({ message: 'Land not found' });
    }

    return res.json(updatedLand);
  } catch (error) {
    console.error('Error deleting land:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

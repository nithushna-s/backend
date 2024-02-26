const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const rentalController = require('../controllers/rentalController');
const contactController = require('../controllers/contactController');
const salesController = require('../controllers/salesController');  
const paymentController = require('../controllers/paymentController');
const landController = require('../controllers/landController');
const { signup, login, logout } = require('../controllers/authController');
const invoiceController = require('../controllers/invoiceController');
const authMiddleware= require('../middlewares/authMiddleware');


router.get('/users', authMiddleware,  userController.getAllUsers);  // Admin routes
router.get('/users/:id', authMiddleware,  userController.getUserById);
router.put('/users/:id', authMiddleware, userController.updateUserById);
router.post('/admin/signup', authMiddleware,  userController.createUser);
router.delete('/users/:id', authMiddleware,  userController.deleteUser);

router.post('/lands/:id/rental',rentalController.submitRentalForm);  // Rental routes
router.get('/admin/rental-details', authMiddleware, rentalController.getAdminRentalDetails);

router.post('/lands/:id/sales', salesController.submitSalesForm);  // Sales routes
router.get('/admin/sales-details', authMiddleware, salesController.getAdminSalesDetails); 

router.post('/payment', paymentController.createPayment);   // Subscription
router.post('/send-email', contactController.sendEmail);    // Contact

router.post('/signup', signup);    // User
router.post('/login', login);
router.post('/logout', logout);

const storage = multer.diskStorage({     // Land
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
 const imageUpload = multer({ storage: storage });  

 router.post('/lands', imageUpload.single('image'), landController.createLand);
 router.get('/lands',  landController.getAllLands);
 router.get('/lands/:id', landController.getLandById);
 router.get('/landsadmin', authMiddleware, landController.getAllLandsAdmin);
 router.put('/lands/:id', imageUpload.single('image'),landController.updateLandById);
 router.patch('/lands/:id', landController.softDeleteLandById);
 router.get('/filter-values',landController.getFilterValues);

router.get('/bill',authMiddleware, invoiceController.getAllInvoices);     // invoice
router.get('/bill/:id', invoiceController.getInvoiceById);
router.post('/bill', invoiceController.createInvoice);
router.put('/bill/:id', invoiceController.updateInvoice);

module.exports = router;

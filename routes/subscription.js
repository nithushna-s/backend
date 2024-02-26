// routes.js

const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Route to create a new subscription
router.post('/subscriptions', subscriptionController.createSubscription);

// Route to cancel an existing subscription
router.post('/subscriptions/cancel', subscriptionController.cancelSubscription);

// Route to update an existing subscription
router.put('/subscriptions/:id', subscriptionController.updateSubscription);

module.exports = router;

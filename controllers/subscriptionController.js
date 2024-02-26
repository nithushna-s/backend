
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Function to create a new subscription
async function createSubscription(req, res) {
  try {
    // Retrieve parameters from the request body
    const { customerId, planId, paymentMethodId } = req.body;

    // Create a customer if not already created
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: req.user.email, // Assuming user information is available in req.user
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    // Attach payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });

    // Set the default payment method on the customer
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: planId }],
      expand: ['latest_invoice.payment_intent']
    });

    // Return the subscription details
    res.status(200).json({ subscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'An error occurred while creating the subscription.' });
  }
}

// Function to cancel an existing subscription
async function cancelSubscription(req, res) {
  try {
    // Retrieve subscription id from the request body
    const { subscriptionId } = req.body;

    // Cancel subscription
    const canceledSubscription = await stripe.subscriptions.del(subscriptionId);

    // Return the canceled subscription details
    res.status(200).json({ canceledSubscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'An error occurred while canceling the subscription.' });
  }
}

// Function to update an existing subscription (e.g., upgrade/downgrade)
async function updateSubscription(req, res) {
  try {
    // Retrieve subscription id and new plan id from the request body
    const { subscriptionId, newPlanId } = req.body;

    // Update subscription
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: subscriptionId, plan: newPlanId }]
    });

    // Return the updated subscription details
    res.status(200).json({ updatedSubscription });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'An error occurred while updating the subscription.' });
  }
}

module.exports = {
  createSubscription,
  cancelSubscription,
  updateSubscription
};

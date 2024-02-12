const stripe = require('stripe')('sk_test_51HEvaHLlNX7wORuBfcF6maeJ60yhJn3E7EWjKO7nAKKpgSoXo0IMUvVS04zQTbuVbHmcuriGxw8ORX1U7wGICybC00eeGtxOih');
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const authJwt = require('../middleware/auth.middleware');
// Create a checkout session endpoint
router.post('/create-checkout-session',authJwt ,async (req, res) => {
    console.log(req.user);
    try {
    
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'URAKKAHUUTO coins',
              },
              unit_amount: parseFloat(req.query.amount)*100, // Amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        client_reference_id: req.user.email,
        success_url: 'http://localhost:3005/success',
        cancel_url: 'http://localhost:3005/cancel',
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Handle success and cancel redirects
  router.get('/success', (req, res) => {
    // Handle successful payment here
    res.render('success');
  });
  
  router.get('/cancel', (req, res) => {
    // Handle payment cancellation here
    res.render('cancel');
  });

  
  module.exports = router;
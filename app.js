var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
const cors = require('cors');
const passport = require('passport');
var app = express();
const dotenv = require('dotenv');
const session = require('express-session');
dotenv.config();
const stripe = require('stripe')('sk_test_51HEvaHLlNX7wORuBfcF6maeJ60yhJn3E7EWjKO7nAKKpgSoXo0IMUvVS04zQTbuVbHmcuriGxw8ORX1U7wGICybC00eeGtxOih');
const endpointSecret = "whsec_ZkCDoJwLadIBGfwxz1ZzuKpHMGEX9JEu";

// database connect
const User = require('./models/user')
const mongoose = require('./config/db');
const morgan = require('morgan');

mongoose.connect();
var bodyParser = require('body-parser');
const { googleStrategy } = require('./config/config');
app.use(session({
	secret: 'bA2xcjpf8y5aSUFsNB2qN5yymUBSs6es3qHoFpGkec75RCeBb8cpKauGefw5qy4',
	resave: true,
	saveUninitialized: true,
  }));
// view engine setup
var corsOptions = {
	origin: '*',
  }

app.use(passport.initialize());
app.use(passport.session());	
app.use('/api/v1/payment/webhook',bodyParser.raw({ type: 'application/json' }),async (request, response) => {

  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
      console.log(err);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }



  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        console.log(paymentIntentSucceeded,"paymentIntentSucceededpaymentIntentSucceeded")
      break;
      case 'checkout.session.completed':
        const payme = event.data.object;
        const Users = await User.findOne({email:payme.client_reference_id})
        Users.balance = parseInt(parseInt(Users.balance) + parseInt(payme.amount_total/100))
        console.log(Users.balance);
        await Users.save()
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  response.send();
});
app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public",express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);
passport.use("google",googleStrategy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
});

module.exports = app;

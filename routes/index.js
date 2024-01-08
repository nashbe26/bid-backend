var express = require('express');
var router = express.Router();


const authRoutes = require('./auth');
const bidRoutes = require('./bid');
const userRoutes = require('./user');
const notification = require('./bid');
const payment = require('./payment');

router.use('/auth', authRoutes);
router.use('/product', bidRoutes);
router.use('/bid', bidRoutes);
router.use('/user', userRoutes);
router.use('/notification', bidRoutes);
router.use('/payment', payment);

module.exports = router;

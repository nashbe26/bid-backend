const express = require('express');
const router = express.Router();
const bidController = require('../controller/bid.controller'); // Import your bid controller
const { multiUploadImages } = require('../utils/multer');
const authJwt = require('../middleware/auth.middleware');

router.post('/bids',authJwt ,bidController.createBid);

router.get('/bids-closed', bidController.getAllClosedBids);
router.get('/bids-comming', bidController.getAllCommingBids);
router.get('/bids-live', bidController.getAllLiveBids);
router.get('/bids-end', bidController.getAllEndingBids);

router.get('/bids/:id', bidController.getBidById);

router.put('/bids/:id', bidController.updateBidById);
router.put('/setWinnerBid/:id', bidController.setWinnerBid);

router.delete('/bids/:id', bidController.deleteBidById);
router.post('/search', bidController.bidSearch);

router.post('/create-images-product',multiUploadImages, bidController.gegtImagesNames);
router.put('/addMessgeToBid',authJwt, bidController.addMessageBidById);

module.exports = router;
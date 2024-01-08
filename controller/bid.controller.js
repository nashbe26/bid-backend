const Bid = require('../models/bid'); // Import your Bid model
const Product = require('../models/product'); // Import your Bid model
const BidMessage = require('../models/messagebid'); // Import your Bid model
const User = require('../models/user'); // Import your Bid model
const cron = require('node-cron');


const gegtImagesNames = async (req, res) => {

    try {
      let files = req.files;
      console.log(req.files);
      let tab = [];
      files.map(x => {
        tab.push(process.env.HOST + x.originalname)
      })
      return res.status(201).json(tab);
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
  
  };
  const updateBidClosedStatus = async (id) => {
    try {

    const bidOne = await Bid.findById(id)
    bidOne.status = "closed"
    await bidOne.save()

    return(`${bidOne._id} bids updated.`);
    
    } catch (error) {
      return('Error updating bid status:', error);
    }
  };
const createBid = async (req, res) => {

    try {   

        let owner = req.user._id;
        let prod = {...req.body,owner};

        const newProduct = new Product(prod)

        let createBid = await newProduct.save()

        

        let bidInfo = new Bid ({
            prod_id:createBid._id,
            amount:createBid.price,
            last_amount:createBid.price,
            owner:createBid.owner,
            type:req.user.type,
            status:'coming soon',
            time:req.body.time,
            date:req.body.date,
            time_end:req.body.time_end,
            date_end:req.body.date_end
        }) 

        console.log(bidInfo);

        const cronExpression = `${bidInfo.time.split(':')[1]} ${bidInfo.time.split(':')[0]} ${bidInfo.date.split('-')[2]} ${bidInfo.date.split('-')[1]} *`;
        const cronExpressionEnd = `${bidInfo.time_end.split(':')[1]} ${bidInfo.time_end.split(':')[0]} ${bidInfo.date_end.split('-')[2]} ${bidInfo.date_end.split('-')[1]} *`;

        const triggerDate = new Date(`${bidInfo.date}T${bidInfo.time}`);
        triggerDate.setHours(triggerDate.getHours() - 1);
        
        const cronPattern = `${triggerDate.getMinutes()} ${triggerDate.getHours()} ${triggerDate.getDate()} ${triggerDate.getMonth() + 1} *`;
        
        const cronExpressionTwo = cronPattern;
        
        cron.schedule(cronExpression, () => {
          updateBidStatus(newBid._id);
        }, {
          scheduled: true,
        });
        cron.schedule(cronExpressionEnd, () => {
            updateBidClosedStatus(newBid._id);
          }, {
            scheduled: true,
          });
        
        cron.schedule(cronExpressionTwo, () => {
            updateBidComingStatus(newBid._id);
            console.log("change to ending soon !");
          }, {
            scheduled: true,
          });
  

        let newBid = await bidInfo.save()

        cron.schedule(cronExpression, () => {
            updateBidStatus(newBid._id)
          }, {
            scheduled: true,
        });
        
        return res.status(201).json({bid:createBid});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateBidStatus = async (id) => {
    try {

    const bidOne = await Bid.findById(id)
    bidOne.status = "live"
    await bidOne.save()

    return(`${bidOne._id} bids updated.`);
    
    } catch (error) {
      return('Error updating bid status:', error);
    }
  };

  const updateBidComingStatus = async (id) => {
    try {

    const bidOne = await Bid.findById(id)
    bidOne.status = "ending soon"
    await bidOne.save()

    return(`${bidOne._id} bids updated.`);
    
    } catch (error) {
      return('Error updating bid status:', error);
    }
  };

const getAllLiveBids = async (req, res) => {
    try {
        const bids = await Bid.find({status:'live'}).populate('prod_id owner');
        return res.status(200).json(bids);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllClosedBids = async (req, res) => {
    try {
        const bids = await Bid.find({status:'closed'}).populate('prod_id owner');
        return res.status(200).json(bids);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllEndingBids = async (req, res) => {
    try {
        const bids = await Bid.find({status:'ending soon'}).populate('prod_id owner');
        return res.status(200).json(bids);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getAllCommingBids = async (req, res) => {
    try {
        const bids = await Bid.find({status:'coming soon'}).populate('prod_id owner');
        return res.status(200).json(bids);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getBidById = async (req, res) => {
    const bidId = req.params.id;
    try {
        const bid = await Bid.findById(bidId).populate('prod_id owner winner').populate({
            path: 'message_bid',
            populate: {
              path: 'sender',
            },options: { sort: { createdAt: -1 } },
          });;
        if (!bid) {
            return res.status(404).json({ error: 'Bid not found.' });
        }
        return res.status(200).json(bid);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateBidById = async (req, res) => {
    const bidId = req.params.id;
    try {
        const updatedBid = await Bid.findByIdAndUpdate(bidId, req.body, { new: true });
        if (!updatedBid) {
            return res.status(404).json({ error: 'Bid not found.' });
        }
        return res.status(200).json(updatedBid);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteBidById = async (req, res) => {
    const bidId = req.params.id;
    try {
        const deletedBid = await Bid.findByIdAndDelete(bidId);
        if (!deletedBid) {
            return res.status(404).json({ error: 'Bid not found.' });
        }
        return res.status(200).json(deletedBid);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const bidSearch = async (req, res) => {
    try {
      
      const { price, search, type } = req.query;
      const priceTab = price.split(',');
      console.log(priceTab);

      const searchResults = await Product.find({
        price: { $gte: priceTab[0], $lte: priceTab[1] },
        title: new RegExp(search, 'i'), 
        
      });
      
      const bidPromises = searchResults.map(async x => {
        return await Bid.findOne({ "prod_id": x._id }).populate('prod_id');
      });
  
      const bid = await Promise.all(bidPromises);
  
      return res.status(200).json(bid);
    } catch (error) {
      
      console.error(error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };

const addMessageBidById = async (req, res) => {
    
    const bidId = req.body.id;
    const bid = req.body;
    
    try {
        
        const getBid = await Bid.findById(bidId).populate({
            path: 'message_bid',
            populate: {
              path: 'sender',
            },
          });

        const messageBid = new BidMessage(bid)
        await messageBid.populate('sender');
        
        let created = await messageBid.save()

        getBid.last_amount = parseInt(bid.bid_amount)
        getBid.message_bid.push(created._id)
        
        const users = await User.findById(req.user._id)
        users.save()

        await getBid.save()
        
        await getBid.populate({
            path: 'message_bid',
            populate: {
              path: 'sender',
            },
          })
        
          if (!getBid) {
            return res.status(404).json({ error: 'Bid not found.' });
        }

        return res.status(200).json({bid:getBid,messageBid,user:users});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const setWinnerBid = async (req, res) => {
    try {
    const getBid = await Bid.findById(req.params.id).populate({
        path: 'message_bid',
        populate: {
          path: 'sender',
        },
    });

    if(!getBid)
        return res.status(500).json({ error: 'Internal Server Error' });
    
    getBid.winner = req.body.winner;
    getBid.status = "closed"

    await getBid.save()
    
    return res.status(200).json({bid:getBid});
    
    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createBid,
    getBidById,
    updateBidById,
    deleteBidById,
    gegtImagesNames,
    getAllLiveBids,
    getAllClosedBids,
    getAllCommingBids,
    addMessageBidById,
    setWinnerBid,
    getAllEndingBids,
    bidSearch
}
const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { sendEmail, verifyYourAccountToken } = require('../utils/mailer');

async function generateHash(input) {
  const saltRounds = 10; // Adjust this based on your security requirements
  const hash = await bcrypt.hash(input, saltRounds);
  return hash.substring(0, 10); // Extracting the first 10 characters
}

const getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUser = async (req, res) => {
    const userId = req.user._id;
    console.log("nddddddddddddddddddd",req.user);
    try {
        const user = await User.findById(userId).populate({
            path: 'fav_bid',
            populate: {
              path: 'prod_id',
            },
        }).populate({
            path: 'bids_won',
            populate: {
              path: 'prod_id',
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateUser = async (req, res) => {
    const userId = req.body.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(200).json(deletedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const sendEmailWithVerification = async (req, res) => {
    const userId = req.user._id;
    try {
        
        const input = 'soundsTokenSecret';
        const getUser = await User.findById(userId);
        
        const shortHash = await generateHash(input)
        getUser.tokenEmail = shortHash;

        await getUser.save()
        console.log({token:shortHash,email:getUser.email,username:getUser.username});
        await sendEmail(verifyYourAccountToken({token:shortHash,email:getUser.email,username:getUser.username}));
        
        return res.status(200).json(getUser);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const verifTokenWithVerification = async (req, res) => {
    const token = req.body.token.replace(/\s/g, '');
    console.log(token);
    try {
        const getUser = await User.findOne({tokenEmail:token});
        console.log(getUser);

        if(getUser){
            getUser.isVerified = true;
            getUser.save()
            return res.status(200).json(getUser);
        }else{
            
            return res.status(500).json('Your token is not valid');
        }
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
const addToFav = async (req, res) => {

    try {
        let user = await User.findOne(req.user._id);

        if (user.fav_bid.includes(req.body.id)) {
            return res.status(400).json({ error: 'Vous avez déjà ajouté ce produit dans votre liste de favoris' });
        }

        user.fav_bid.push(req.body.id)
        await user.save();

        return res.status(200).json({ user })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Failed to add product' });
    }

};
const changePassword = async (req, res) => {
    const { password, newPassword } = req.body;
  
    const userId = req.user._id

    try {
      // Fetch the user from the database
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Compare the entered password with the stored hashed password
      const isMatch = bcrypt.compare(password, user.password);
  
      if (isMatch) {
        // If the entered password matches, update the password with the new one
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
        user.password = hashedPassword;
        await user.save();
  
        return res.status(200).json({ message: 'Password updated successfully' });
      } else {
        return res.status(401).json({ error: 'Incorrect current password' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  const deleteToFav = async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.user._id });

        const index = user.fav_bid.indexOf(req.body.id);
        if (index !== -1) {
            user.fav_bid.splice(index, 1);
            await user.save();
        } else {
            return res.status(400).json({ error: 'Vous avez déjà ajouté ce produit dans votre liste de favoris' });
        }

        return res.status(200).json({ user });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

module.exports = {
    getAllUser,
    getUserById,
    updateUser,
    deleteUserById,
    getUser,
    sendEmailWithVerification,
    verifTokenWithVerification,
    changePassword,
    addToFav,
    deleteToFav
};

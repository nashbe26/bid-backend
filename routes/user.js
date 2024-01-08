const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller'); // Import your user controller
const authJwt = require('../middleware/auth.middleware');

router.get('/', userController.getAllUser);

router.get('/get-user',authJwt ,userController.getUser);

router.get('/:id', userController.getUserById);

router.put('/update-user',authJwt ,userController.updateUser);

router.delete('/:id',authJwt ,userController.deleteUserById);
router.post('/send-email-token',authJwt ,userController.sendEmailWithVerification);
router.post('/verif-email-token',authJwt ,userController.verifTokenWithVerification);
router.post('/change-password',authJwt ,userController.changePassword);
router.post('/add-fav',authJwt ,userController.addToFav);
router.post('/delete-fav',authJwt ,userController.deleteToFav);

module.exports = router;

const Notification = require("../models/notification");
const User = require('../models/user');

const deleteNotification = async (req, res) => {
    try {
        let notificationId = req.query.notifId
        const notification = await Notification.findById(notificationId).catch(
            (err) => {
                console.log(err);
                res.status(500).json("Internal server err")
            }
        );
        if (!notification) throw httpError(404, "can not find this notification");
        if (notification.id_receiver.toString() === userId.toString()) {
            await notification.deleteOne().catch((err) => {
                console.log(err);
                res.status(500).json("Internal server err")
            });
            return res.status(200).json({ err: "notification deleted" });;

        } else {
            res.status(500).json("you can only delete your notification");
        }
    } catch (err) {
        res.status(500).json(err)

    }

};
const seenNotif = async (req, res) => {
    try {
        let userId = req.user._id;

        const notifications = await Notification.find({ id_receiver: userId }).catch(
            (err) => {
                console.log(err);
                res.status(500).json("Internal server err");
            }
        );
        notifications.filter(x => x.is_checked === false).map(async x => {
            x.is_checked = true
            await x.save()
        })

        return res.status(200).json({ notifications });;
    } catch (err) {
        res.status(500).json(err)

    }

};
const getNotifications = async (req, res) => {
    try {
        let userId = req.user._id;
        console.log(req.user._id);
        const notifications = await Notification.find({ id_receiver: userId }).populate('id_owner').sort({ "createdAt": -1 }).catch(
            (err) => {
                console.log(err);
                res.status(500).json("Internal server err")
            }
        );
        return res.status(200).json({ notifications });;
    } catch (err) {
        res.status(500).json(err)

    }

};

const createNotification = async (req, res) => {

    let {
        id_owner: owner,
        id_receiver: receiver,
        description,
        type,
    } = req.body;

    try {
        switch (type) {
            case "favoris":
                description =
                    "un client a ajouté votre produits dans sa liste de favoris";
                break;
            case "achat":
                description =
                    "un client a vient d'acheter votre produit";
                break;
            case "offre":
                description =
                    receiver.firstName +
                    " " +
                    receiver.lastName +
                    "vous avez reçu une nouvelle offre de de prix";
                break;
            case "follow":
                description =
                   
                    "un utilisateur commencer vous suivre";
                break;
            case "all":
                description =
                    
                    "un utilisateur qui vous suivez a ajouté un nouveau produit.";
                break;
            case "end_job":
                description =
                    "Votre offre de travail est expiré. veuillez la renouveller ou la retirer";
                break;
        }

        const notification = new Notification({
            id_owner: req.body.id_owner,
            id_receiver: req.body.id_receiver,
            description,
            type: req.body.type,
        });

        const user = await User.findById(req.body.id_receiver)
        user.notifications.push(notification._id)

        notification.save();
        user.save();

        return res.status(200).json({ notification });

    } catch (err) {
        return res.status(500).json(err)
    }


};

module.exports = {
    deleteNotification,
    getNotifications,
    createNotification,
    seenNotif
};
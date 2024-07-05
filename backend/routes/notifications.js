const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification.js");
const verifyuser = require("../middleware/verifyuser.js");

router.get("/getnotifications", verifyuser, async (req, res) => {
    try {
        const allNotifications = await Notification.find({ receivingUser: req.curruser.id });
        res.status(200).send(allNotifications);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;

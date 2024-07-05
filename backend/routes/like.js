const express = require("express");
const router = express.Router();
const Like = require("../models/Like.js");
const Post = require("../models/Post.js");
const User = require("../models/User.js");
const Notification = require("../models/Notification.js");
const verifyuser = require("../middleware/verifyuser.js");

router.post("/addlike", verifyuser, async (req, res) => {
    try {
        const newLike = new Like({
            post: req.body.postId,
            likedUser: req.curruser.id
        });

        const post = await Post.findOne({ _id: req.body.postId });

        const user = await User.findOne({ _id: post.user });

        const newLikeNotification = new Notification({
            link: `/post/${req.body.postId}`,
            type: "like",
            sendingUser: req.curruser.id,
            receivingUser: user._id
        });

        await newLike.save();
        if (req.curruser.id != user._id) await newLikeNotification.save();

        res.status(200).send({ msg: "Like <3 posted" });
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET LIKES DONE BY A USER

router.post("/getlikesofuser", verifyuser, async (req, res) => {
    try {
        const allLikes = await Like.find({ likedUser: req.body._id });
        res.status(200).send(allLikes);

    } catch (error) {
        res.status(400).send(error);
    }
});


// GET LIKES OF A POST
router.post("/getlikes", verifyuser, async (req, res) => {
    try {
        const allLikes = await Like.find({ post: req.body.postId });
        const currUserLike = await Like.findOne({ post: req.body.postId, likedUser: req.curruser.id });
        if (currUserLike) {
            res.status(200).send({ currUserLike: true, likes: allLikes });
        }
        else {
            res.status(200).send({ currUserLike: false, likes: allLikes });
        }

    } catch (error) {
        res.status(400).send(error);
    }
});


router.delete("/deletelike", verifyuser, async (req, res) => {
    try {
        await Like.deleteOne({ post: req.body.postId, likedUser: req.curruser.id });

        const post = await Post.findOne({ _id: req.body.postId });

        const user = await User.findOne({ _id: post.user });

        if (req.curruser.id != user._id) await Notification.deleteOne({ type: "like", sendingUser: req.curruser.id, receivingUser: user._id });

        res.status(200).send({ msg: "Like <3 removed" });

    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;

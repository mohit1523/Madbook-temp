const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.js");
const Post = require("../models/Post.js");
const User = require("../models/User.js");
const Notification = require("../models/Notification.js");
const verifyuser = require("../middleware/verifyuser.js");

router.post("/addcomment", verifyuser, async (req, res) => {
    try {
        const newComment = new Comment({
            post: req.body.post,
            user: req.curruser.id,
            commentText: req.body.text
        });

        const post = await Post.findOne({_id : req.body.post});

        const user = await User.findOne({_id: post.user});

        const newCommentNotification = new Notification({
            link: `/post/${req.body.post}`,
            type: "comment",
            sendingUser: req.curruser.id,
            receivingUser: user._id
        });

        await newComment.save();
        if(req.curruser.id != user._id) await newCommentNotification.save();

        res.status(200).send({ msg: "Comment posted" });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/getcomments", verifyuser, async (req, res) => {
    try {
        const allComments = await Comment.find({ post: req.body.postId });
        if (allComments) {
            res.status(200).send(allComments);
        } else {
            res.status(200).send([]);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/getcommentsOfuser", verifyuser, async (req, res) => {
    try {
        const allComments = await Comment.find({ user: req.body._id });
        if (allComments) {
            res.status(200).send(allComments);
        } else {
            res.status(200).send([]);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/deletecomment", verifyuser, async (req, res) => {
    try {
        await Comment.deleteOne({_id : req.body.commentId});

        res.status(200).send({ msg: "Comment deleted" });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;

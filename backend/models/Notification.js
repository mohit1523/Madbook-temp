const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    link: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    sendingUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receivingUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = new mongoose.model("Notification", notificationSchema);

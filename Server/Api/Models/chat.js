const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    channelId: Number,
    userName: String,
    date: {type : Date, default : Date.now},
    message: String,
});


module.exports = mongoose.model('Chat',chatSchema);
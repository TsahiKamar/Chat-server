const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: String,
    password:String//,
    //__v:Number
 
});


module.exports = mongoose.model('User',userSchema); 
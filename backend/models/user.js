const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    profile_img_url: String,
})

module.exports = mongoose.model('User', userSchema);
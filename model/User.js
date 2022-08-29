const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phone: Number,
    email: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
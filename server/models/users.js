var mongoose = require("mongoose");
var Schema=mongoose.Schema;
var userSchema=new Schema({
    username: String,
    password: String,
    email: String,
    playingGames:[Number],
    favoriteGameType:[Number],
    playingTime:Number,
    platform:[Number],
    team:[Number]
});
module.exports = mongoose.model("user", userSchema);

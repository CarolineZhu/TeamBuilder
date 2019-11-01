var mongoose = require("mongoose");
var Schema=mongoose.Schema;
var userSchema=new Schema({
    username: String,
    password: String,
    email: String,
    playingGames:[String],
    favoriteGameType:[String],
    playingTime:String,
    platform:[String],
    role:String

});
module.exports = mongoose.model("user", userSchema);

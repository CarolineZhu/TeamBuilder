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
    teams:[{
        id:String,
        name:String
    }],
    invitations:[String],
    team_invitations:[{
        teamid:String,
        teamname:String,
        invitor:String
    }],
    friends:[String],
    comments:[{
        commentator:String,
        rate:Number
    }],
    rating:{
        type:Number,
        default:0
    },
    blocked:[String],
});
module.exports = mongoose.model("user", userSchema);

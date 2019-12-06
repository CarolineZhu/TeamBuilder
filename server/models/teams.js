var mongoose = require("mongoose");
var Schema=mongoose.Schema;
var teamSchema=new Schema({
    name: String,
    creator:String,
    members:[String],
    activities:[{
        title:String,
        content:String,
        date:String
    }],
    historyMessage:[{
        username:String,
        message:String,
        time:String
    }]
});
module.exports = mongoose.model("team", teamSchema);
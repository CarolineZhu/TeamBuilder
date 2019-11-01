var mongoose = require("mongoose");
var Schema=mongoose.Schema;
var gameSchema=new Schema({
    name: String,
    type: String,
});
module.exports = mongoose.model("game", gameSchema);
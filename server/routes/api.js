var express = require('express');
var router = express.Router();
var recommend = require('./recommend')
var mongoose=require('mongoose');
var Users=require('../models/users');
mongoose.connect('mongodb://127.0.0.1:27017/Players',{useNewUrlParser: true });
mongoose.connection.on("connected",()=>{
    console.log("connect success.");

});

mongoose.connection.on("error",(error)=>{
    console.log(error);
});

mongoose.connection.on("disconnected",()=>{
    console.log("disconnect.");
});

function on_err(req, res, err, message){
    console.log(err);
    res.json({
        status:'500',
        error:err,
        message:message
    });
}

router.post("/register",  (req, res, next) => {
    var username=req.body.username;
    var password=req.body.password;
    var email=req.body.email;
    var playingGames = req.body.playingGames;
    var favoriteGameType = req.body.favoriteGameType;
    var role = req.body.role;
    var playingTime;
    var platform = req.body.platform;
    switch(req.body.playingTime) {
        case "morning":
            playingTime = 0;
        case "afternoon":
            playingTime = 1;
        case "evening":
            playingTime = 2;
        case "weekends":
            playingTime = 3;
    }
    Users.findOne({username:username },  (err, doc) => {
        if(err){
            on_err(req, res, err, "error when findOne.");
        }else if (doc){
            on_err(req, res, undefined, "user already exist.");
        }else {
            Users.create({
                username: username,
                password: password,
                email: email,
                playingGames:playingGames,
                favoriteGameType:favoriteGameType,
                role:role,
                playingTime:playingTime,
                platform:platform
            },  (err, doc) => {
                if (err){
                    on_err(req, res, err, "error when create user.");
                }else{
                    res.json({
                        status:'200',
                        msg:"",
                        result:{
                        }
                    });
                }
            });
        }
    });
});

router.post("/login",  (req, res, next) => {
    var username= req.body.username;
    var password= req.body.password;
    Users.findOne({username:username, password:password}, (err, doc) => {
        if(err){
            on_err(req, res, err, "error when finding user.");
        }else if(!doc) {
            res.json({
                status:'201',
                message:"username or password wrong.",
                error: undefined,
                result:{
                }});
        }else {
            var cartNum=0;
            res.cookie("userid",doc._id.toString(),{
                path:'/',
                maxAge:1000*60*600
            });
            res.cookie("username",doc.username,{
                path:'/',
                maxAge:1000*60*600
            });
            res.json({
                status:'200',
                message:"",
                result:{
                    userid:doc._id,
                    username:doc.username,
                }});
        }
    })
});

router.get("/get_user_info",  (req, res, next) => {
    var username=req.query.username;
    Users.findOne({
        username:username,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when finding orders.");
        }else{
            if (doc) {
                res.json({
                    status: '200',
                    message: "",
                    result: {
                        userid: doc._id,
                        username: doc.username,
                        playingGames: doc.playingGames,
                        favoriteGameType: doc.favoriteGameType,
                        playingTime: doc.playingTime,
                        platform: doc.platform
                    }
                });
            }
        }
    });
});

router.get("/get_recommendation",  (req, res, next) => {
    console.log("API Called: Get Recommendation...")
    var username=req.query.username;
    Users.findOne({
        username:username,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when finding orders.");
        }else{
            if (doc) {
                recommend(Users, doc, 10, res);
            }
        }
    });

});


module.exports = router;

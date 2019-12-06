var express = require('express');
var router = express.Router();
var recommend = require('./recommend')
var mongoose=require('mongoose');
var Users=require('../models/users');
var Teams = require('../models/teams');
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
                    friends:doc.friends,
                    messageNum:doc.invitations.length+doc.team_invitations.length
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
                        platform: doc.platform,
                        rating:doc.rating,
                        comments:doc.comments
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

router.get("/get_friend_list",  (req, res, next) => {
    console.log("API Called: Get friend list...")
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
                        friends: doc.friends,
                    }
                });
            }
        }
    });

});
router.get("/show_invitation_list",  (req, res, next) => {
    console.log("API Called: Show invitation list...")
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
                        invitations: doc.invitations,
                        team_invitations:doc.team_invitations
                    }
                });
            }
        }
    });

});

router.post("/send_invitation",  (req, res, next) => {
    console.log("API Called: Send invitation...")
    var username=req.body.username;
    var player=req.body.player;
    Users.findOne({
        username:player,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when finding orders.");
        }else{
            if (doc) {
                if (!doc.invitations.includes(username)) {
                    doc.invitations.push(username);
                    doc.save();
                }
                res.json({
                    status:'200',
                    message:"",
                    result:{
                    }
                });
            }
        }
    });
});

router.post("/deny_invitation", (req, res, next)=>{
    var username=req.body.username;
    var player=req.body.player;
    Users.findOne({
        username:username,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when accept invitations.");
        }else{
        for( var i = 0; i < doc.invitations.length; i++){
            if ( doc.invitations[i] === player) {
                doc.invitations.splice(i, 1);
                doc.save();
            }
    }
        res.json({
            status:'200',
            message:"",
            result:{
            }
        });
        }
    });
});
router.post("/accept_invitation",  (req, res, next) => {
    console.log("API Called: Accept invitation...");
    var username=req.body.username;
    var player=req.body.player;
    console.log(player);
    Users.findOne({
        username: player,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when accept invitations.");
        }else{
            console.log(doc);
            if (doc) {
                if (!doc.friends.includes(username)) {
                    doc.friends.push(username);
                    doc.save();
                    console.log("find user.");
                Users.findOne({
                    username:username,
                }, (err, doc2)=> {
                    if (err) {
                        on_err(req, res, err, "error when finding orders.");
                    }else{
                        if (doc2) {
                            if (!doc2.friends.includes(player)) {
                                doc2.friends.push(player);
                            }
                            for( var i = 0; i < doc2.invitations.length; i++){
                                if ( doc2.invitations[i] === player) {
                                    doc2.invitations.splice(i, 1);
                                    break
                                }
                            }
                            console.log(doc2);
                            doc2.save((err)=>{
                                console.log(err);
                            });
                        }
                    }
                });
                }
            }
            res.json({
                status:'200',
                message:"",
                result:{
                }
            });
        }
    });

});

router.post("/delete_friend", (req, res, next)=>{
    var username=req.body.username;
    var player=req.body.player;
    Users.findOne({
        username:username,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when delete friends.");
        }else{
            if (doc) {
                for( var i = 0; i < doc.friends.length; i++) {
                    if (doc.friends[i] === player) {
                        doc.friends.splice(i, 1);
                        doc.save();
                    }
                }
                Users.findOne({
                    username:player,
                }, (err, doc2)=> {
                    if (err) {
                        on_err(req, res, err, "error when finding orders.");
                    }else{
                        if (doc2) {
                            for( var i = 0; i < doc2.friends.length; i++) {
                                if (doc2.friends[i] === username) {
                                    doc2.friends.splice(i, 1);
                                    doc2.save();
                                }
                            }
                        };
                    }
                    res.json({
                        status:'200',
                        message:"",
                        result:{
                        }
                    });
                });
            }
        }
    });
});


router.post("/rate_friends", (req, res, next)=>{
    var username=req.body.username;
    var player=req.body.player;
    var rating = req.body.rating;
    Users.findOne({
        username:player,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when rate friends.");
        }else{
            if (doc) {
                if (!doc.friends.includes(username)) {
                    on_err(req, res, err, "Not in friends list.");
                    return
                }
                for (var i = 0; i < doc.comments.length; i++) {
                    if (doc.comments[i].commentator == username) {
                        on_err(req, res, err, "Already rated.");
                        return
                    }
                }
                doc.rating = (doc.rating * doc.comments.length + rating) / (doc.comments.length + 1);
                doc.comments.push({
                   commentator : username,
                   rate : rating
                });
                doc.save();
            }
            res.json({
                status:'200',
                message:"",
                result:{
                }
            });
        }
    });
});

router.post("/block_and_delete_friends", (req, res, next)=>{
    var username=req.body.username;
    var player=req.body.player;
    Users.findOne({
        username:username,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when delete friends.");
        }else{
            if (doc) {
                doc.blocked.push(player);
                for( var i = 0; i < doc.friends.length; i++) {
                    if (doc.friends[i] === player) {
                        doc.friends.splice(i, 1);
                        doc.save();
                    }
                }
                Users.findOne({
                    username:player,
                }, (err, doc2)=> {
                    if (err) {
                        on_err(req, res, err, "error when finding orders.");
                    }else{
                        if (doc2) {
                            doc2.blocked.push(username);
                            for( var i = 0; i < doc2.friends.length; i++) {
                                if (doc2.friends[i] === username) {
                                    doc2.friends.splice(i, 1);
                                    doc2.save();
                                }
                            }
                        };
                    }
                    res.json({
                        status:'200',
                        message:"",
                        result:{
                        }
                    });
                });
            }
        }
    });
});

router.get("/get_team_info", (req, res, next) => {
    var teamid = req.query.teamid;
    Teams.findOne({
        _id:teamid,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when finding orders.");
        }else{
            if (doc) {
                res.json({
                    status: '200',
                    message: "",
                    result: {
                        name: doc.name,
                        creator:doc.creator,
                        members:doc.members,
                        activities:doc.activities,
                        historyMessage:doc.historyMessage
                    }
                });
            }
        }
    });
});

router.get("/get_team_list",  (req, res, next) => {
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
                        teams: doc.teams,
                    }
                });
            }
        }
    });

});

router.post("/create_team",  (req, res, next) => {
    var username=req.body.username;
    var teamname = req.body.teamname;
    Teams.create({
        name: teamname,
        creator:username,
        members:[username],
        activities:[],
        historyMessage:[]
    },  (err, doc) => {
            if (err){
                on_err(req, res, err, "error when create team.");
            }else{
                Users.findOne({username:username},(err, doc2)=> {
                    if(err){
                        on_err(req, res, err, "error when add team to user.");
                    }else{
                        doc2.teams.push({
                            id:doc._id,
                            name:doc.name
                    });
                        doc2.save();
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

router.post("/send_team_invitation",  (req, res, next) => {
    var username=req.body.username;
    var teamid=req.body.teamid;
    var teamname=req.body.teamname;
    var player=req.body.player;
    var isInvited=false;
    Users.findOne({
        username:player,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when finding orders.");
        }else{
            if (doc) {
                for(var i=0;i<doc.team_invitations.length;i++){
                    if(doc.team_invitations[i]["team"]===teamid) {
                        isInvited = true;
                        break
                    }
                }
                if(!isInvited){
                    doc.team_invitations.push({
                        teamid:teamid,
                        teamname:teamname,
                        invitor:username
                    });
                    doc.save();
                }
                res.json({
                    status:'200',
                    message:"",
                    result:{
                    }
                });
            }
        }
    });
});

router.post("/deny_team_invitation", (req, res, next)=>{
    var username=req.body.username;
    var invitor=req.body.invitor;
    var teamid = req.body.teamid;
    Users.findOne({
        username:username,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when accept invitations.");
        }else{
            for( var i = 0; i < doc.team_invitations.length; i++){
                if ( doc.team_invitations[i]["teamid"] === teamid && doc.team_invitations[i]["invitor"] === invitor) {
                    doc.team_invitations.splice(i, 1);
                    break;
                }
            }
            doc.save();
            res.json({
                status:'200',
                message:"",
                result:{
                }
            });
        }
    });
});

router.post("/accept_team_invitation",  (req, res, next) => {
    var username=req.body.username;
    var invitor=req.body.invitor;
    var teamid = req.body.teamid;
    var teamname = req.body.teamname;
    Users.findOne({
        username: username,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when accept invitations.");
        }else{
            if (doc) {
                if (!doc.teams.includes(teamid)) {
                    for( var i = 0; i < doc.team_invitations.length; i++){
                        if ( doc.team_invitations[i]["teamid"] === teamid && doc.team_invitations[i]["invitor"] === invitor) {
                            doc.team_invitations.splice(i, 1);
                            break;
                        }
                    }
                    doc.teams.push({
                        id:teamid,
                        name:teamname,
                    });
                    doc.save();
                    console.log("find user.");
                    Teams.findOne({
                        _id:teamid,
                    }, (err, doc2)=> {
                        if (err) {
                            on_err(req, res, err, "error when finding orders.");
                        }else{
                            if (doc2) {
                                if (!doc2.members.includes(username)) {
                                    doc2.members.push(username);
                                }
                                doc2.save((err)=>{
                                    console.log(err);
                                });
                                res.json({
                                    status:'200',
                                    message:"",
                                    result:{
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });

});

router.post("/create_activity",  (req, res, next) => {
    var username=req.body.username;
    var teamid = req.body.teamid;
    var date = req.body.date; //string
    Teams.findOne({
        _id:teamid,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when create activities.");
        }else{
            if (doc) {
                var curTime = new Date();
                var activityTime = new Date(date); //string to Date object.
                // Try to only show the create activity button to owner in front end.
                if (doc.creator != username) {
                    on_err(req, res, err, "You are not team owner.");
                } else if (curTime.getTime() > activityTime.getTime()) {
                    // console.log(curTime);
                    // console.log(activityTime);
                    //Try to only show incoming time in front end.
                    on_err(req, res, err, "Can not create past activities.");
                } else {
                    var new_activity = {
                        title:req.body.title,
                        content:req.body.content,
                        date: date
                    };
                    doc.activities.push(new_activity);
                    doc.save();
                    res.json({
                        status:'200',
                        message:"",
                        result:{
                        }
                    });
                }
            }
        }
    });
});

//Method for team's activities page.
router.get("/get_activities",  (req, res, next) => {
    var teamId=req.query.teamId;
    var curTime = new Date();
    Teams.findOne({
        _id : teamId,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when finding users.");
        }else{
            if (doc) {
                var activitiesList = [];
                for (var i = 0; i < doc.activities.length; i++) {
                    var isExpired;
                    var activityTime = new Date(doc.activities[i].date);
                    if (curTime.getTime() > activityTime.getTime()) 
                        isExpired = true;
                    else isExpired = false;
                    var activity = {
                        title: doc.activities[i].title,
                        content: doc.activities[i].content,
                        date: doc.activities[i].date,
                        isExpired: isExpired
                    }
                    activitiesList.push(activity);
                }
                res.json({
                    status:'200',
                    message:"",
                    result:{
                        activities: activitiesList
                    }
                });
            }
        }
    });
});

//Method for each user's main page.
router.get("/get_calendar",  (req, res, next) => {
    var username=req.query.username;
    var curTime = new Date();
    var first = curTime.getDate() - curTime.getDay(); // First day of this week(Sunday).
    var last = first + 6; // Last day.
    // console.log(first);
    // console.log(last);
    Users.findOne({
        username:username,
    }, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when finding users.");
        }else{
            if (doc) {
                var activitiesList = [];
                for (var i = 0; i < doc.teams.length; i++) {
                    Teams.findOne({
                        _id:doc.teams[i].id,
                    }, (err, doc2)=> {
                        if (err) {
                            on_err(req, res, err, "error when finding teams.");
                        }else{
                            if (doc2) {
                                for (var j = 0; j < doc2.activities.length; j++) {
                                    var activityTime = new Date(doc2.activities[j].date);
                                    //Get activities only in this week.
                                    if (activityTime.getDate() >= first && activityTime.getDate() <= last) {
                                        //Check if it expired. If it did, show grey in calendar. Otherwise show green.
                                        var isExpired;
                                        if (curTime.getTime() > activityTime.getTime()) 
                                            isExpired = true;
                                        else isExpired = false;
                                        var activity = {
                                            title: doc2.activities[j].title,
                                            content: doc2.activities[j].content,
                                            date: doc2.activities[j].date,
                                            teamId: doc2._id,
                                            isExpired: isExpired
                                        };
                                        console.log(activity);
                                        activitiesList.push(activity);
                                    }
                                }
                                res.json({
                                    status:'200',
                                    message:"",
                                    result:{
                                        activities: activitiesList
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
});

//The size of bar of different activities will vary. Sometimes it can be very small. 
//We can show the details in a small window when we click on it.
//If you don't think it is necessary, just leave it alone.
router.get("/show_activity_details",  (req, res, next) => {
    var activity=req.query.activity;
    res.json({
        status:'200',
        message:"",
        result:{
            details: activity
        }
    });
});




module.exports = router;

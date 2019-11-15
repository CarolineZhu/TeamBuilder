function distance(player1, player2) {
    var dist = 0;
    var dim = player1.favoriteGameType.length;
    for (var i = 0; i < dim; i++) {
        dist += (player1.favoriteGameType[i] - player2.favoriteGameType[i]) * (player1.favoriteGameType[i] - player2.favoriteGameType[i])
    }
    return [dist, player2]
}

function recommend(Users, player, k, res) {
    var platformList = player.platform;
    var gameList = player.playingGames;
    var query = { $and: [ { "username": {"$nin":player.friends} }, { "username": {"$nin":player.blocked} } ],"playingTime": player.playingTime, "platform": {"$in": platformList}, "playingGames":{"$in": gameList}};
    Users.find(query, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when finding orders.");
        }else{
            if(doc) {
                var recommendationList = [];
                for(var i = 0; i < doc.length; i++) {
                    if(doc[i].username !== player.username && !doc[i].invitations.includes(player.username)){
                        var current = distance(player, doc[i]);
                        var rating = doc[i].rating == 0 ? 5 : doc[i].rating;
                        current[0] /= rating;
                        recommendationList.push(current);
                    }
                }
                recommendationList.sort(function (a, b) {
                    return (a[0] - b[0])
                });
                res.json({
                        status: '200',
                        message: "Recomendation returned: ",
                        result: {
                            recommendationList: recommendationList.slice(0, k)
                        }

                });
            }

        }
    });
}

module.exports = recommend;

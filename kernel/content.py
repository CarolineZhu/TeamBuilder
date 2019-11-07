from pymongo import MongoClient
from pprint import pprint


def recommend(player, k):
    platformList = player["platform"]
    gameList = player["playingGames"]
    group = db.playerInfo.find({"playingTime": player["playingTime"], "platform": {"$in": platformList}, "playingGames":{"$in": gameList}})
    distList = []
    for i in group:
        if i != player:
            distList.append(distance(player, i))
    distList.sort(key=lambda x: x[0])
    return distList[:k]


def distance(player1, player2):
    dist = 0
    dim = len(player1["favoriteGameType"])
    for i in range(dim):
        dist += (player1["favoriteGameType"][i] - player2["favoriteGameType"][i]) * (player1["favoriteGameType"][i] - player2["favoriteGameType"][i])
    return dist, player2

if __name__ == '__main__':
    client = MongoClient("mongodb://127.0.0.1:27017/")
    db = client.Players
    currentPlayer = db.playerInfo.find({"id": 0})
    result = recommend(currentPlayer[0], 10)
    pprint(result)

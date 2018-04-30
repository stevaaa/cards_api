'use strict';

var express     = require("express");
var router      = express.Router();

var GameStats   = require("../models/cardsGameModel").GameStats;

router.param("gameID", function(req,res,next,id){
	GameStats.findById(id, function(err, doc){
		if(err) return next(err);
		if(!doc) {
			err = new Error("Not Found");
			err.status = 404;
			return next(err);
		}
		req.gamestats = doc;
		return next();
	});
});


router.param("playerID", function(req, res, next, id){
    req.player = req.gamestats.players.id(id);
    if(!req.player) {
        err = new Error("Not Found");
        err.status = 404;
        return next(err);
    }
    next();
});

//GET request
//root               //resumeGame or newGame
//route to get the current active game
router.get("/", function(req, res, next){
    GameStats.find({})
                    .sort({createdAt: -1})
                    .exec(function(err, games){
                        if(err) return next(err);
                        console.log(games);
                        res.json(games);
                    });
});

//POST /newgame
//Route for creating new game
router.post("/newgame", function(req, res, next){
	var gamestats = new GameStats(req.body);
	gamestats.save(function(err, gamestats){
		if(err) return next(err);
		res.status(201);
		res.json(gamestats);
	});
});

//GET /cardgame/:gameID
//Route for specific gameID
router.get("/:gameID", function(req, res, next){
    res.json(req.gamestats);
});

//POST /cardgame/:gameID/players
//Rpute for creating new players
router.post("/:gameID/players", function(req, res, next){
    console.log(req.gamestats);
    req.gamestats.players.push(req.body);
    req.gamestats.save(function(err, gamestats){
        if(err) return next(err);
        res.status(201);
        res.json(gamestats);
    })
});

//GET  players profile
router.get("/:gameID/players/:playerID", function(req, res, next){
    res.json(req.player);
});

//PUT  Edit players score
router.put("/:gameID/players/:playerID", function(req, res){
    req.body.score += req.player.score;
    req.body.wins += req.player.wins;
    req.player.update(req.body, function(err, result){
        if(err) return next(err);
        res.json(result);
    });
});

module.exports = router;
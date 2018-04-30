'use strict';
var mongoose    = require("mongoose");
var Schema      = mongoose.Schema;

// var sortAnswers = function(a,b){

// }

var playersSchema = new Schema({
    name: String,
    avatar: String,
    score: Number,
    wins: Number,
    vote: Number,
    updatedAt: {type:Date, default: Date.now}
});

playersSchema.method("update", function(updates, callback){    
    Object.assign(this, updates, {updatedAt: new Date()});
    this.parent().save(callback);
});

// playersSchema.method("vote", function(vote, callback){
//     if(vote == "up") {
//         this.vote += 1;
//     }  else {
//         this.vote -= 1;
//     }
//     this.parent().save(callback);
// });

// playersSchema.pre("save", function(next){
//     this.answers.sort();
//     next();
// });

var GameStatsSchema = new Schema({
    existingGame: {type: String, default: false},
    round_number: {type: Number, default: 0},
    total_rounds: {type: Number, default: 25},
    createdAt: {type: Date, default: Date.now},
    players: [playersSchema]
});


// PreSave hook
// GameStatsSchema.pre("save", function(next){
//     this.gamestats;
//     next();
// });

var GameStats = mongoose.model("gamestats", GameStatsSchema);
module.exports.GameStats = GameStats;

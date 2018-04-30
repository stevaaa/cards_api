'use strict'

var express     = require("express");
var app         = express();
var routes      = require("./routes/cardsGameRoutes");
var port        = process.env.PORT || 3000;

var jsonParser  = require("body-parser").json;
var logger      = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

//connect to mongoDB with mongoose
var mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost:27017/cardsgame");

var db          = mongoose.connection;

db.on("error", function(err){
    console.error("connection error!", err);
});

db.once("open", function(){
    console.log("db connection successful!");
});

app.use("/cardgame", routes);

// catch 404 and forward to error handler
app.use(function(req, res, next){
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// Error Handler
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

app.listen(port, function(){
    console.log("ExpressServer for cardsGame is listening on port ", port);
    
});
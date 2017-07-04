var express = require("express");
var path = require("path");
require('dotenv').config();
var bodyParser = require('body-parser');
var messenger = require(__dirname + "/routes/messenger.js");
var accountManager = require(__dirname + "/routes/accountManager.js");
let apiRouter = require(__dirname + "/routes/api.js").router;

var app = express();


app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next()
});

app.use(messenger.router);
app.use(apiRouter);
app.use(accountManager.router);
app.use(express.static(path.join(__dirname, '../App/teller-app/dist')));

app.set('views', __dirname + '/views');


app.get("/api", function(req,res){
  res.send("Hello World")
});


app.get("/",function(req,res){
  res.sendFile(  path.resolve(__dirname + "/../App/teller-app/dist/index.html"));
});

app.listen(process.env.PORT, function(err){
    console.log("Application successfully running on port: " + process.env.PORT)
});


var express = require("express");
var path = require("path")
require('dotenv').config()
var bodyParser = require('body-parser');
var messenger = require(__dirname + "/routes/messenger.js");
var accountManager = require(__dirname + "/routes/accountManager.js");

var app = express()

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(messenger.router);
app.use(accountManager.router);
app.use(express.static(path.join(__dirname, '../App/teller-app/dist')))

app.set('views', __dirname + '/views');


app.get("/",function(req,res){
  res.sendFile(  path.resolve(__dirname + "/../App/teller-app/dist/index.html"))
})


app.get("/signup",function(req,res){
  res.sendFile(__dirname + "/views/signup.html")
});

app.listen(process.env.PORT, function(err){
  console.log("Application successfully running on port: " + process.env.PORT)
});


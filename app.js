var express = require("express");
var path = require("path")
var bodyParser = require('body-parser');
var messenger = require(__dirname + "/routes/messenger.js");
var plaid = require(__dirname + "/routes/plaid.js");
require('dotenv').config()

var app = express()

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(messenger);
app.use(plaid);

app.set('views', __dirname + '/views');
app.use("/static", express.static(path.join(__dirname, 'public')))

app.get("/",function(req,res){
  res.sendFile(__dirname + "/views/index.html")

  console.log("Hello world")
})

app.get("/signup",function(req,res){
  res.sendFile(__dirname + "/views/signup.html")
});

app.listen(process.env.PORT);


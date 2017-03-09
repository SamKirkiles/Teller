var express = require("express");
var bodyParser = require('body-parser');
var messenger = require(__dirname + "/routes/messenger.js");
var plaid = require(__dirname + "/routes/plaid.js");

var app = express()

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(messenger);
app.use(plaid);

app.set('views', __dirname + '/views');


app.get("/",function(req,res){
    res.sendFile(__dirname + "/views/index.html")
    
    console.log("Hello world")
})

app.listen(3000);


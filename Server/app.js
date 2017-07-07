var express = require("express");
var path = require("path");
require('dotenv').config();
var bodyParser = require('body-parser');
var messenger = require(__dirname + "/app/routes/messenger.js");
var accountManager = require(__dirname + "/app/controllers/bankAccountManager.js");
let apiRouter = require(__dirname + "/app/routes/api.router.js").router;

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

app.get('/test', function(req,res){
   // accountManager.getTransactions('access-sandbox-69f55d88-526c-48a1-a872-27f5b505d7a0, '')
});

app.get("/",function(req,res){
  res.sendFile(  path.resolve(__dirname + "/../App/teller-app/dist/index.html"));
});

app.listen(process.env.PORT, function(err){
    console.log("Application successfully running on port: " + process.env.PORT)
});


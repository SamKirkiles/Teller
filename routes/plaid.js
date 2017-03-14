var express = require("express")
var router = express.Router();
var plaid = require('plaid');
require('dotenv').config()
var mysql = require('mysql');


var plaidClient = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments.sandbox);

router.post("/authenticate", function(request,response){
    var publicToken = request.body.public_token
    console.log(publicToken);

    plaidClient.exchangePublicToken(publicToken, function(err, res){
        if (err != null){
            console.log(err.error_message + err.error_code);
            return
        }
        access_token = res.access_token;
        console.log('Access Token: ' + access_token);
    });
});

function getBalance(access_token, callback){
    plaidClient.getBalance(access_token, function(err, mfaResponse, response){
        console.log(response)
        console.log(mfaResponse)
    });
}

module.exports = router

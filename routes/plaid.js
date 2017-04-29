var express = require("express")
var router = express.Router();
var plaid = require('plaid');
require('dotenv').config()
var mysql = require('mysql');


const plaidClient = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments.sandbox);

router.post("/authenticate", function(request,response){
    var publicToken = request.body.public_token

    plaidClient.exchangePublicToken(publicToken, function(err, res){
        if (err != null){
            console.log(err.error_message + err.error_code);
            return
        }
        access_token = res.access_token;
    });
});



function getBalance(access_token, callback){
    plaidClient.getBalance(access_token, function(err, response){
        callback(response.accounts);
    });

    plaidClient.getInstitutions(10,10,function(err,response){
        console.log(response)
    })
}

module.exports = {
    balance: getBalance,
    router: router
}

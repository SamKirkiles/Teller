var express = require("express")
var router = express.Router();
var plaid = require('plaid');
require('dotenv').config()


var plaidClient = new plaid.Client(process.env.PLAID_CLIENT_ID,process.env.PLAID_SECRET,plaid.environments.tartan);

router.post("/authenticate", function(req,res){
    var publicToken = req.body.public_token
        
    plaidClient.exchangeToken(publicToken, function(err,exchangeTokenRes){
        if (err != null){
            //handle error
            res.send("There was an error: " + err.message )
        }else{

            var access_token = exchangeTokenRes.access_token;

            //save this acces token to database

            plaidClient.getAuthUser(access_token, function(err, authRes){
                if (err != null){
                    res.send("There was an error: " + err.message)
                } else {
                    var accounts = authRes.accounts;
                    res.json({accounts:accounts})
                }
            })
        }
    });
});

function getBalance(access_token, callback){
    plaidClient.getBalance(access_token, function(err, mfaResponse, response){
        console.log(response)
        console.log(mfaResponse)
    });
}

module.exports = router

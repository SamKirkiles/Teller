var express = require("express")
var router = express.Router();
var plaid = require('plaid');

var client_id = '58b19b60bdc6a44288ea2050'
var public_key = 'e839335cc584216e29feff916f1d77'
var secret = 'b9f6580301de6cf4bac33353f87f4e'

var plaidClient = new plaid.Client(client_id,secret,plaid.environments.tartan);

router.post("/authenticate", function(req,res){
    var publicToken = req.body.public_token
    
    console.log(publicToken);
    
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

module.exports = router

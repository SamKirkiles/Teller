var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser');
var apiaimanager = require(__dirname + "/apiaimanager.js")
var request = require("request")
require('dotenv').config()

var plaid = require(__dirname + "/plaid.js")

var jsonParser = bodyParser.json();

router.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');    
    }
});

router.post('/webhook', jsonParser, function(req,res){

    let messaging_events = req.body.entry[0].messaging

    messaging_events.forEach(function(event) {
        if (event.message && event.message.text){
            let text = event.message.text
            receivedMessage(event)
        }
    });

    res.sendStatus(200);
    
})

//called when the user sends a message
function receivedMessage(event){

    apiaimanager.textRequest(event.message.text,function(response, error){

        if (response){
            //CHECK BALANCE
            if (response.result.action === 'check-balance'){
                
                if (response.result.actionIncomplete){
                    //action is not complete meaning we need to wait for another callback when we have all the infromation we can just print out what api.ai wants
                    sendMessage(event.sender.id, response.result.fulfillment.speech)
                }else{
                    //we have the complete response meaning we have all the variables 
                    plaid.balance('access-sandbox-69f55d88-526c-48a1-a872-27f5b505d7a0',function(accounts){

                    //go through all of the accounts returned from plaid API

                    accounts.forEach(function(account) {

                        //if the account type matches the type of account we want to see the balance of, we may continue 
                        if (account.type === response.result.parameters.account){
                            //check if the balance can be retrieved
                            if (account.balances.available == null){
                                sendMessage(event.sender.id,"The balance of this account is not available")
                            }else{
                                var balance = account.balances.available;
                                var result = response.result.fulfillment.speech.replace('$balance',`$${balance}`)
                                sendMessage(event.sender.id, result) 
                            }
                        } 
                    }, this);
                })

                }
            }

            //VIEW ACCOUNTS
            if (response.result.action === 'view-accounts'){

                plaid.balance('access-sandbox-69f55d88-526c-48a1-a872-27f5b505d7a0',function(accounts){
                    sendMessage(event.sender.id, response.result.fulfillment.speech, function(){
                        accounts.forEach(function(account) {
                            sendMessage(event.sender.id, account.name)
                        }, this);
                    })
                });

            }
        }
    });


}

function sendMessage(recipient, message, callback){
    var options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        method: "POST",
        qs: {access_token:process.env.FB_MESSENGER_TOKEN},
        json:{
            recipient: {
                id: recipient
            },
            message:{
                text: message
            }
        }
    }

    request(options,function(error,incomingMessage,response){
        if (!error){
            if (callback){
                callback()
            }
        }
    });
}

module.exports = router;

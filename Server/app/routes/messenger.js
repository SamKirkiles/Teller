require('dotenv').config();
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let apiaimanager = require(__dirname + "/apiaimanager.js");
let request = require("request");
let balance = require(__dirname + "/../../balance.js");
let path = require("path");
let assert = require("assert");
let plaid = require(__dirname + "/../controllers/bankAccountManager.js");

let jsonParser = bodyParser.json();

router.get('/api/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token')
    }
});

router.post('/api/webhook', jsonParser, function(req,res){

    let messaging_events = req.body.entry[0].messaging;

    messaging_events.forEach(function(event) {
        if (event.message && event.message.text){
            let text = event.message.text;
            receivedMessage(event)
        }
    });

    res.sendStatus(200);
    
});

//called when the user sends a message
function receivedMessage(event){


    apiaimanager.textRequest(event.message.text,function(response, error){

        if (response){
            console.log(response.result.action);
            //CHECK BALANCE
            if (response.result.action === 'check-balance'){
                balance.checkBalance(
                    response.result.parameters.account, 
                    response.result.parameters.bank, 
                    response.result.fulfillment.speech, 
                    response.result.actionIncomplete, 
                    'access-sandbox-c4d2b9ff-a609-4753-878e-4ef6f1583594',
                    function(result){
                        sendMessage(event.sender.id, result)
                    }
                )
            }else if (response.result.action === 'view-accounts'){ //VIEW ACCOUNTS

                plaid.balance('access-sandbox-c4d2b9ff-a609-4753-878e-4ef6f1583594',function(accounts){
                    sendMessage(event.sender.id, response.result.fulfillment.speech, function(){
                        accounts.forEach(function(account) {
                            sendMessage(event.sender.id, account.name)
                        }, this);
                    })
                });
            }else if (response.result.action === 'view-transactions'){
                response.result.parameters;
                balance.viewTransactions(response.result.parameters.date,response.result.parameters["date-period"],response.result.actionIncomplete, 'access-sandbox-c4d2b9ff-a609-4753-878e-4ef6f1583594', function(result){
                    sendMessage(event.sender.id, result)
                })
            }else if (response.result.action.substr(0,9) === "smalltalk"){
                sendMessage(event.sender.id, response.result.fulfillment.speech, function(){

                })
            }
        } else{
            console.log("ERROR: Response was nil on receivedMessage")
        }
    });
}

function sendMessage(recipient, recipientmessage, callback){
    var options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        method: "POST",
        qs: {access_token:process.env.FB_MESSENGER_TOKEN},
        json:{
            recipient: {
                id: recipient
            },
            message:{
                text: recipientmessage
            }
        }
    };

    request(options,function(error,incomingMessage,response){
        if (!error){
            if (callback){
                callback()
            }
        }
    });
}

module.exports = {
    router:router,
};


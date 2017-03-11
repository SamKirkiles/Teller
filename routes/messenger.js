var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser');
var apiaimanager = require(__dirname + "/apiaimanager.js")
var request = require("request")
require('dotenv').config()

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

function receivedMessage(event){

    apiaimanager.textRequest(event.message.text,function(response, error){

        if (response != null){
            //response.result.fulfillment.speech
            sendMessage(event.sender.id, response.result.fulfillment.speech)
        }
    });

}

function sendMessage(recipient, message){
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
            console.log("complete")
        }
    });
}

module.exports = router;

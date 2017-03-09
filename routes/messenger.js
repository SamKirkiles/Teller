var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser');
var apiaimanager = require(__dirname + "/apiaimanager.js")
var request = require("request")


var jsonParser = bodyParser.json();

var token = "EAAFhcDC2C1IBANSBiWBoZAZBCic6nTAbQZCeZB2NeK5waC6MiKSYkRSgdc02823OtOMRJZC5dfCTPSPdCdVa0hEZB4CJasmYZAADbgBmVMa80EWZAaUc9UIlV6hFPLZBmGHFdgaWSZAknSkZA13t247A4R6iFZBxtw8oQ62u01Cz5yZBYgQZDZD"

router.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'tellerverifytoken') {
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
        qs: {access_token:token},
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

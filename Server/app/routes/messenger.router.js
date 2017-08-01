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
let botManager = require(__dirname + "/../../bot/botManager.js");
var messenger = require(path.resolve("./app/controllers/messenger-controller.js"));
let Intent = require(__dirname + "/../../bot/intent-model.js");
let shortid = require('shortid');

let jsonParser = bodyParser.json();

router.get('/api/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token')
    }
});

router.post('/api/webhook', jsonParser, function(req,res){

    let messaging_events = req.body.entry;


    messaging_events.forEach(function(event) {
        if (event.messaging && event.messaging[0].message){
            try{
              receivedMessage(event.messaging[0])
            }catch(error){
                console.log(error)
            }
        }else if (event.messaging[0].account_linking){

            let authorizationCode = event.messaging[0].account_linking.authorization_code;
            let status= event.messaging[0].account_linking.status;

            console.log(authorizationCode);

            if (status === 'linked'){
                //linked
            } else{
                //unlinked
            }

        } else{
            console.error("ERROR: unidentified Webhook")
        }
    });
    res.sendStatus(200);
});

router.get('/api/authorize',jsonParser, function(req,res){
   let linkingToken = req.query.account_linking_token;
   let redirectURL = req.query.redirect_uri;

    var options = {
        url: 'https://graph.facebook.com/v2.6/me/',
        method: "GET",
        qs: {
            access_token: process.env.FB_MESSENGER_TOKEN,
            fields:"recipient",
            account_linking_token:linkingToken}
    };

    request(options, function(error,incomingMessage,response){
        let recipient = JSON.parse(response).recipient;
        //now save the user id in the database
        let authToken = shortid.generate();
        console.log(recipient);
        console.log(authToken);

        res.redirect(redirectURL + "&authorization_code="+ authToken);

    });


});


//called when the user sends a message
function receivedMessage(event){

    apiaimanager.textRequest(event.message.text,function(response, error){
        messenger.verifyMessengerUser(event.sender.id, function(credsResponse) {
            if (!response){
                //we have an error
                throw error
            }else{
                //we are good to continue

                let messageIntent = new Intent(event.sender.id, response, credsResponse.succeeded);

                try {
                    botManager.handleIntent(messageIntent);
                }catch(e){
                    console.error(e);
                }

            }
        });

    });
}


module.exports = {
    router:router
};

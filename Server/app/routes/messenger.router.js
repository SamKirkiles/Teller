require('dotenv').config();
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let apiaimanager = require(__dirname + "/../controllers/apiai-manager.js");
let request = require("request");
let balance = require(__dirname + "/../../balance.js");
let path = require("path");
let assert = require("assert");
let plaid = require(__dirname + "/../controllers/bankAccountManager.js");
let botManager = require(__dirname + "/../../bot/botManager.js");
var messenger = require(path.resolve("./app/controllers/messenger-controller.js"));
let Intent = require(__dirname + "/../../bot/intent-model.js");
let shortid = require('shortid');
let mysql = require('mysql');

var pool  = mysql.createPool({
    connectionƒLimit : 6,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'teller_production_rds'
});


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

            if (status === 'linked'){
                //linked
            } else{
                let sender = event.messaging[0].sender.id;
                pool.query('UPDATE user SET messengerID=null WHERE messengerID=?', [sender], function(error, results, fields){
                    //the user has been logged out
                });
            }

        } else{
            console.error("ERROR: unidentified Webhook")
            console.log(event)
        }
    });
    res.sendStatus(200);
});

router.post('/api/authorize',jsonParser, function(req,res){
    //We need to abstract this method so the user does not have access to the messenger token
   let linkingToken = req.body.accountLinkingToken;
   let redirectURL = req.body.redirectURL;
   let userID = req.body.userID;

    var options = {
        url: 'https://graph.facebook.com/v2.6/me/',
        method: "GET",
        qs: {
            access_token: process.env.FB_MESSENGER_TOKEN,
            fields:"recipient",
            account_linking_token:linkingToken
        }
    };

    request(options, function(error,incomingMessage,response){
        let recipient = JSON.parse(response).recipient;
        //now save the user id in the database
        let authToken = shortid.generate();

        pool.query('UPDATE user SET messengerID=? WHERE userID=?', [recipient, userID] , function(error, results, fields){
            console.log("The results of the query are:");
            console.log(results);
        });

        if (error){
            res.status(200).send({payload:{success:false, authenticationToken:null, messengerID:null},error:{errorCode:error.errorCode,errorMessage:error.errorMessage}});
        }else{
            res.status(200).send({payload:{success:true, authenticationToken:authToken, messengerID:recipient},error:{errorCode:null,errorMessage:null}})
        }

    });


});


//called when the user sends a message
function receivedMessage(event){

    apiaimanager.textRequest(event.message.text, event.sender.id, function(response, error){
        messenger.verifyMessengerUser(event.sender.id, function(credsResponse) {
            if (!credsResponse){
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


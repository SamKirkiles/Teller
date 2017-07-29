let path = require('path')
let Intent = require(__dirname + "/intent-model.js");
var messenger = require(path.resolve("./app/controllers/messenger-controller.js"));

function smalltalk(intent){

    messenger.sendMessage(intent.accountID, intent.messageData.result.fulfillment.speech, function(callback){
        console.log("Intent Completed: " + intent.messageData.result.action + " User: " + intent.accountID + " Registered: " + intent.registered);
    });
}


module.exports = {
    smalltalk: smalltalk
};
let path = require('path')
let Intent = require(__dirname + "/intent-model.js");
var messenger = require(path.resolve("./app/controllers/messenger-controller.js"));

function logOut(intent){

    messenger.sendLogOut(intent.accountID, function(callback){
        console.log("Intent Completed: " + intent.messageData.result.action + " User: " + intent.accountID + " Registered: " + intent.registered);
    });
}

function logIn(intent){
    messenger.sendLogin(intent.accountID, function(callback){
        console.log("Intent Completed: " + intent.messageData.result.action + " User: " + intent.accountID + " Registered: " + intent.registered);
    });
}

module.exports = {
    logOut: logOut,
    logIn: logIn
};
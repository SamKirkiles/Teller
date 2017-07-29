let path = require('path')
let Intent = require(__dirname + "/intent-model.js");
var messenger = require(path.resolve("./app/controllers/messenger-controller.js"));

function smalltalk(intent){

    console.log(typeof messenger);


    messenger.sendMessage(intent.accountID, "Hey how are you", function(callback){

    });

}

module.exports = {
    smalltalk: smalltalk
};
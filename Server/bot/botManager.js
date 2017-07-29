
let balance = require(__dirname + "/balance-intent.js");
let Intent = require(__dirname + "/intent-model.js");

let smalltalk = require(__dirname + "/smalltalk-intent.js");


let intents = {
    "check-balance": balance.checkBalance,
    "smalltalk.greetings.hello": smalltalk.smalltalk
};

function handleIntent(intent){
    if (intent instanceof Intent){

         console.log("The given intent is: " +  intent.action);

        if (typeof intents[intent.action] === "function" ){
            intents[intent.action](intent)
        }else{
            throw new Error("There was no matching intent with the given action.");
        }

    }else{
        throw new Error("The given parameter was not an Intent.")
    }
}

module.exports = {
    handleIntent: handleIntent
};
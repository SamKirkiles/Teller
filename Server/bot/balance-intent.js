let plaid = require('plaid');
let mysql = require('mysql');
let path = require('path');
var messenger = require(path.resolve("./app/controllers/messenger-controller.js"));

var pool  = mysql.createPool({
    connectionƒLimit : 6,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'teller_production_rds'
});


const plaidClient = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments.sandbox
);

function checkBalance(intent){

    let access_token = 'access-sandbox-c4d2b9ff-a609-4753-878e-4ef6f1583594';

    plaidClient.getBalance(access_token, function(err, response){
        if (err) throw err;
        else if (intent.registered === false) {
            messenger.handleUnregisteredUser(intent.accountID);
        }
        else {
            let message = "Here is your balance rundown for all of you accounts: \n";

            Array.from(response.accounts).forEach(function(item){

                let balance = (item.balances.current || item.balances.available);

                message = message + item.name + " $" + balance +  "\n";
            });

            messenger.sendMessage(intent.accountID, message, function(callback){
                console.log("Intent Completed: " + intent.messageData.result.action + " User: " + intent.accountID + " Registered: " + intent.registered);
            })
        }
    });

}

module.exports = {
    checkBalance: checkBalance
};
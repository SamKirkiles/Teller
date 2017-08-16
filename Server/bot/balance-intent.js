let plaid = require('plaid');
let mysql = require('mysql');
let path = require('path');
var messenger = require(path.resolve("./app/controllers/messenger-controller.js"));
let bankAccountManager = require(__dirname + '/../app/controllers/bankAccountManager.js')
let undefsafe = require('undefsafe')


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

    // get this from the database



    if (intent.registered === false) {
        messenger.handleUnregisteredUser(intent.accountID);
    }else{

        // we need to query the users bank access token

        bankAccountManager.getPlaidAccessToken(null, intent.accountID, function(tokenRes,tokenError){
            let tokenRes_undefsafe = undefsafe(tokenRes, '');
            
            if (tokenError) throw tokenError;
            else if(tokenRes.length === 0 || tokenRes_undefsafe[0].plaid_private_ID === null){
                messenger.sendMessage(intent.accountID, 'There is no bank linked to this Teller account.', function(callback){
                    console.log("There is no bank linked to your account")
                })

                return;
            }

            let access_token = tokenRes[0].plaid_private_ID;

            plaidClient.getBalance(access_token, function(err, response){
                if (err) {
                    console.log(err);
                    throw err;
                } else {
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
        });


    }

}

module.exports = {
    checkBalance: checkBalance
};
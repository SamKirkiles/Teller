let plaid = require('plaid');
let mysql = require('mysql');
let path = require('path');
var messenger = require(path.resolve("./app/controllers/messenger-controller.js"));
let undefsafe = require('undefsafe');
let shortid = require('shortid');
const url = require('url');
const querystring = require('querystring');


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

// this intent sees what purchases the user has made. It should show a webview showing all of the purchases in a nice angular list
function checkPurchases(intent){

    let accessToken = 'access-sandbox-c4d2b9ff-a609-4753-878e-4ef6f1583594';
    var startDate;
    var endDate;

    let params = undefsafe(intent.messageData.result.parameters, '');

    if (params['date']){
        startDate = intent.messageData.result.parameters['date'];
        endDate = intent.messageData.result.parameters['date'];
    } else if (params['date-period']){
        startDate = params['date-period'].substr(0,10);
        endDate = params['date-period'].substr(11,20);
    } else{
        let message = "There were no transactions for this date";
        messenger.sendMessage(intent.accountID, message, function(callback){
            console.log("Intent Completed: " + intent.messageData.result.action + " User: " + intent.accountID + " Registered: " + intent.registered);
        });
        return;
    }

    plaidClient.getTransactions(accessToken,startDate, endDate, {}, function(err, results){

        if (err !== null){
            console.log(err.error_code + ': ' + err.error_message);
        }else {

            let total_transactions = undefsafe(results, 'total_transactions');
            var message;

            if (total_transactions > 0 || total_transactions !== undefined && total_transactions !== null) {

                let token = shortid.generate();

                message = "I found " + results.total_transactions + " transactions from this date.";

                pool.query('INSERT INTO view_transaction_request (token, startDate, endDate, messengerID) VALUES (?, ?, ?, ?)', [token, startDate, endDate, intent.accountID], function(error, results,fields){


                    var baseUrl;

                    var baseUrl;
                    if (process.env.NODE_ENV === "Dev"){
                        login = 'https://teller-development-frontend.ngrok.io';
                    }else{
                        login = 'https://tellerchatbot.com';
                    }

                    let query = querystring.stringify({token:token});

                    let url = login + '/viewtransactions' + '/?' + query;

                    messenger.sendLink(intent.accountID, message, url, 'Transactions', function(){

                    });
                });

                return;

            } else {
                message = "There were no transactions for this date";
            }

            messenger.sendMessage(intent.accountID, message, function (callback) {
                console.log("Intent Completed: " + intent.messageData.result.action + " User: " + intent.accountID + " Registered: " + intent.registered);
            });
        }
    });
}

module.exports = {
    checkPurchases: checkPurchases
};
/**
 * Created by samkirkiles on 8/6/17.
 */
let plaid = require('plaid');
let mysql = require('mysql');
let path = require('path');
let shortid = require('shortid');
var messenger = require(path.resolve("./app/controllers/messenger-controller.js"));

var pool  = mysql.createPool({
    connectionLimit : 6,
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

function createBudget(intent){

    // get this from the database
    let access_token = 'access-sandbox-c4d2b9ff-a609-4753-878e-4ef6f1583594';

    if (intent.messageData.result.actionIncomplete === true) {
        messenger.sendMessage(intent.accountID, intent.messageData.result.fulfillment.speech, function(callback){

        })
    }else{
        console.log(intent.messageData.result.parameters);
        messenger.sendMessage(intent.accountID, intent.messageData.result.fulfillment.speech, function(callback){
            // do steps to create budget here
            let budgetID = shortid.generate();
            let amount = intent.messageData.result.parameters.amount.amount;
            let startDate = intent.messageData.result.parameters['date-period'][0].substr(0,10);
            let endDate = intent.messageData.result.parameters['date-period'][0].substr(11, 20);

            console.log(budgetID + amount + startDate, endDate + intent.accountID);

            pool.query('INSERT INTO budget (budgetID, amount, periodStart, periodEnd, messengerID) VALUES (?, ?, ?, ?, ?)', [budgetID, amount, startDate, endDate, intent.accountID], function(err, results, fields){
                if(err){
                    console.log("The error is");
                    console.log(err.message);
                    throw err;
                }
                else{
                    console.log(results);
                }
            });
        })
    }
}

module.exports = {
    createBudget: createBudget
};
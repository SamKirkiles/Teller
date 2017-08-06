let envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});
let shortid = require('shortid');
let express = require('express');
let bodyParser = require('body-parser');
let mysql = require('mysql');
let router = express.Router();
let plaid = require('plaid');
let undefsafe = require('undefsafe');

let jsonParser = bodyParser.json();

const plaidClient = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments.sandbox
);

let pool = mysql.createPool({
    connectionLimit : 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'teller_production_rds'
});

//this will get all of the transactions the user currently has for the specified dates
router.post('/api/transactions', jsonParser, function(req, res ,err){
    let psid = req.body.psid;
    let token = req.body.token;

    //get the token out of the database and check if it exists and if the psid matches the tokens psid

    pool.query('SELECT user.plaid_private_ID, user.messengerID, DATE_FORMAT(view_transaction_request.startDate, "%Y-%m-%d") AS startDate, DATE_FORMAT(view_transaction_request.endDate, "%Y-%m-%d") AS endDate FROM user LEFT JOIN view_transaction_request ON view_transaction_request.messengerID=user.messengerID WHERE user.messengerID=? && view_transaction_request.token=?'
        , [req.body.psid, token], function(error, results, fields){

        if (error){
            res.status(200).send({payload:{success: false}, error:{errorCode:error.errorCode, errorMessage:error.errorMessage}});
            return;
        }

        if (results.length > 0){
            // we have succeeded and can now use plaid to return the items
            let transactionRequest = undefsafe(results[0], '');
            let plaidAccess = transactionRequest.plaid_private_ID;
            let startDate = transactionRequest.startDate;
            let endDate = transactionRequest.endDate;

            if (plaidAccess){
                plaidClient.getTransactions(plaidAccess, startDate, endDate, {}, function(plaidError, plaidResults){
                    if (plaidError){
                        res.status(200).send({payload:{success: false, results: null}, error:{errorCode:plaidError.error_code, errorMessage:plaidError.error_message}});
                    } else{
                        // now we are all set to send the user the plaid response
                        res.status(200).send({payload:{success: true, results: plaidResults}, error:{errorCode:null, errorMessage:null}})
                    }
                });
            }else{
                res.status(200).send({payload:{success: false}, error:{errorCode:'INVALID_BANK_CREDS', errorMessage:'There was no bank account linked to the given user.'}})
            }

        }else{
            res.status(200).send({payload:{success: false}, error:{errorCode:'NO_RESULTS', errorMessage:'This link is not valid or has expired.'}})
        }
    });
});



module.exports = {
    router:router
};

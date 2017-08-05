let envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});
let shortid = require('shortid');
let express = require('express');
let bodyParser = require('body-parser');
let mysql = require('mysql');
let router = express.Router();

let jsonParser = bodyParser.json();

let pool = mysql.createPool({
    connectionLimit : 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'teller_production_rds'
});

router.post('/api/transactions', jsonParser, function(req, res ,err){
    let psid = req.body.psid;
    let token = req.body.token;

    //get the token out of the database and check if it exists and if the psid matches the tokens psid

    pool.query('SELECT user.plaid_private_ID, user.messengerID, view_transaction_request.startDate, view_transaction_request.endDate FROM user LEFT JOIN view_transaction_request ON view_transaction_request.messengerID=user.messengerID WHERE user.messengerID=? && view_transaction_request.token=?'
        , [req.body.psid, token], function(error, results, fields){
        if (result.length > 0){
            // we have succeeded and can now use plaid to return the items
        }else{

        }
    });
});



module.exports = {
    router:router
};

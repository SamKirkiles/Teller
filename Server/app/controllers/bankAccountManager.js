let envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});

let express = require("express");
let router = express.Router();

let plaid = require('plaid');
let mysql = require('mysql');

let fs = require("fs");


const plaidClient = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments.sandbox);

router.post("/authenticate", function(request,response){
    let publicToken = request.body.public_token;
    
    plaidClient.exchangePublicToken(publicToken, function(err, res){
        if (err != null){
            console.log(err.error_message + err.error_code);
            return
        }
        access_token = res.access_token;
    });
});



function getBalance(access_token, callback){
    plaidClient.getBalance(access_token, function(err, response){
        if (err !== null){
            console.error(err.error_message)
        }else{
            callback(response.accounts);
        }
    });

}

/** Wrapper for plaid get Transactions
 * @param {string} start_date - Start Date: The date to start fetching at
 * @param {string} end_date - End Date: THe date to end fetching the transactios
 * @param {string} access_token - Access Token: The access token to use to fetch the accounts
 * @param {string} callback - Callback Function: The function to use to obtain a response
 * */

function getTransactions(start_date, end_date, access_token, callback){
    plaidClient.getTransactions(access_token, start_date, end_date, {}, function(err,response){
        callback(response)
    })
}

function generateInsitutionsCSV(){
        //create writable stream
        //add to stream every get insititutions call and keep looping to filesystem
        //pipe to file system

        fs.unlinkSync('file.csv');

        var stream = fs.createWriteStream('file.csv',{
             autoClose: true,
             'mode': "0666",
             flags:'a'
        });

        var counter = 0;

        //retrieve all institutions starting at counter = 0
        plaidClient.getInstitutions(500,counter,function(err,response){

            console.log(err);
            console.log(response.institutions);
            for (let bank in response.institutions){
                 
                let responseString = response.institutions[bank].name.replace('(',"");
                responseString = responseString.replace(')',"");
                
                stream.write("\""+responseString+"\",\n")
            }
            stream.end()
        })
}

module.exports = {
    balance: getBalance,
    transactions: getTransactions,
    router: router,
    generateInsitutionsCSV: generateInsitutionsCSV
};

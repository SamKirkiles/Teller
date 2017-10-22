let envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});


let express = require("express");
let router = express.Router();

let plaid = require('plaid');

let mysql = require('mysql');

let fs = require("fs");

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


/** Exchange public token for private token
 * @param {string} token
 * @param {function(error, private_token)} callback
 */
function exchangeToken(token, callback){
    plaidClient.exchangePublicToken(token, function(err, res){
        if (err === null){
            console.log("successfully authenticated account")
            const access_token = res.access_token;
            console.log(access_token);
            callback(null, access_token);
        }else{
            callback(err, null);
        }
    })
}

function getPlaidAccessToken(userID, messengerID, callback){

    if (userID){
        //we have the user id so we can now use this to query
        pool.query('SELECT plaid_private_ID FROM user WHERE userID=?', [userID], function(err, results, fields){
           if (err){
               callback(null, err);
           }
           else{
               callback(results, null);
           }
        });
    }else if (messengerID){
        // we have the messenger id so we can use this to query the correct user
        pool.query('SELECT plaid_private_ID FROM user WHERE messengerID=?', [messengerID], function(err, results, fields){
            if (err){
                callback(null, err);
            }
            else{
                callback(results, null);
            }
        });
    }else{
        throw new Error('Both userID and messengerID were null');
    }
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
    getPlaidAccessToken: getPlaidAccessToken,
    router: router,
    generateInsitutionsCSV: generateInsitutionsCSV,
    exchangeToken: exchangeToken
};

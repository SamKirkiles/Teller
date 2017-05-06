var envPath = __dirname + "/../.env"
require('dotenv').config({path:envPath})

var express = require("express")
var router = express.Router();

var plaid = require('plaid');
var mysql = require('mysql');

var fs = require("fs");


const plaidClient = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments.sandbox);

router.post("/authenticate", function(request,response){
    var publicToken = request.body.public_token

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
        callback(response.accounts);
    });

}

function generateInsitutionsCSV(){

        //create writable stream
        //add to stream every get insititutions call and keep looping to filesystem
        //pipe to file system

        fs.unlinkSync('file.csv')

        var stream = fs.createWriteStream('file.csv',{
             autoClose: true,
             'mode': 0666,
             flags:'a'
        })

            counter = 0;

        //retrieve all institutions starting at counter = 0
        plaidClient.getInstitutions(500,counter,function(err,response){

            console.log(err)
            console.log(response.institutions)
            for (var bank in response.institutions){
                 
                var responseString = response.institutions[bank].name.replace('(',"")
                responseString = responseString.replace(')',"")
                
                stream.write("\""+responseString+"\",\n")
            }
            stream.end()
        })
        counter += 500;


}

module.exports = {
    balance: getBalance,
    router: router,
    generateInsitutionsCSV: generateInsitutionsCSV
}

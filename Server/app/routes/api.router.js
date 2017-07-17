let envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});
let shortid = require('shortid');
let express = require('express');
let apiRouter = express.Router();
let bodyParser = require('body-parser');
let mysql = require('mysql');
let bcrypt = require('bcryptjs');

let jwt = require('jsonwebtoken');

let bankAccountManager = require(__dirname + "/../controllers/bankAccountManager.js");

let aws = require('aws-sdk');
let ses = new aws.SES({
    region:"us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});


let jsonParser = bodyParser.json();

let connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'teller_production_rds'
});

connection.connect(function(err) {
    if (err !== null) {
        console.error('Error connecting to database: ' + err.message);
    } else {

    }
});


/*
Body: {email:""}
 */
apiRouter.put('/api/requestPasswordReset',jsonParser, function(req,res){

    // we have the email so we should send a request with the link to reset the password

    if (req.body.email === undefined){
        res.status(400);
        return;
    }

    // require('fs').readFile(, 'utf8', function(err,html){
    //     console.log(__dirname + '/../../views/emailHeader.html');
    //     console.log(html);
    //     console.log(err);
    // });

    let headerURL = __dirname + '/../../views/emailHeader.html';

    var html = require('fs').readFileSync(headerURL, 'utf8');
    console.log(html);


    let messageBody = "Here is your requested email reset link";



    let params = {
        Destination:{
            ToAddresses:[
                req.body.email
            ]
        },
        Message: {
            Subject: { /* required */
                Data: 'Verify Account With Teller', /* required */
                Charset: 'UTF-8'
            },
            Body: { /* required */
                Html: {
                    Data: html,
                    Charset: 'UTF-8'
                },
                Text: {
                    Data: messageBody, /* required */
                    Charset: 'UTF-8'
                }
            }

        },
        Source: 'admin@tellerchatbot.com', /* required */
        ReplyToAddresses: [
        ],
        ReturnPathArn: 'arn:aws:ses:us-east-1:010702067800:identity/tellerchatbot.com',
        SourceArn: 'arn:aws:ses:us-east-1:010702067800:identity/tellerchatbot.com',

    };

    ses.sendEmail(params, function(err,data){
        if (err) {
            res.status(200).send({"payload":{"success":false},"error":{"errorCode":err.code, "message":err.message}});
            console.log(err);
        }
        else {
            console.log("Sending success");
            res.status(200).send({"payload":{"success":true,"data":data},"error":{"errorCode":null, "message":null}});
        }

    });

});

apiRouter.post('/api/signin', jsonParser, function(req,res){

    let email = req.body.email;
    let password = req.body.password;

    console.log('signin pressed');

    testConnection(query);

    function query() {

        //find all results
        connection.query('SELECT * FROM user WHERE email=?',[email],function(error, results, fields){


        //there should be no error here
        if (results[0] !== null  && error === null){

            bcrypt.compare(password, results[0].password.toString(), function(err, bcryptResponse) {

                if (bcryptResponse === true){

                    let user = {
                        date_created: results[0].date_created,
                        fullname: results[0].fullname,
                        email: results[0].email,
                        userID: results[0].userID
                    };

                    //the login was successful and we have a user that we have now turned into a stirng

                    jwt.sign({ userID: results[0].userID }, 'secret', { algorithm: 'HS256' }, function(jwtErr, token) {
                        
                        if (jwtErr === null){
                            res.status(200).send({"payload":{"success":true, "token":token},"error":{"errorCode":null, "message":null}});

                        }else{
                            res.status(200).send({"payload":{"success":false, "token":null},"error":{"errorCode":jwtErr.code, "message":jwtErr.message}});
                        }

                    });

                }else{
                    res.status(200).send({"payload":{"success":false, "token":null},"error":{"errorCode":null, "message":null}});
                }
            });
        }else{
            res.status(200).send({"payload":{"success":false, "token":null},"error":{"errorCode":error.errorCode, "message":error.message}});

        }

    });
    }
});

apiRouter.post('/api/currentuser', jsonParser, function(req,res){
    jwt.verify(req.body.token, 'secret', { algorithm: 'HS256'}, function (err, decoded){
        if (err !== null){
            res.status(200).send({'payload':{'success':true, 'result':err}});
        }else{

            //make sure database is connected and run the function to retrieve current user
            testConnection(currentUser);

            function currentUser(){
                userID = decoded.userID;

                //get the current user from the database and send it
                connection.query('SELECT * FROM user WHERE userID = ?',[userID],function(err, results, fields){

                    if (err !== null){
                        res.status(200).send({'payload':{'success':false, 'result':null}});
                    }else {
                        if (results[0] !== undefined){
                            res.status(200).send({'payload':{'success':true, 'result':results[0]}});
                        }else {
                            res.status(200).send({'payload':{'success':false, 'result':null}});
                        }
                    }
                });
            }
        }
    });
});

apiRouter.post('/api/plaidID', jsonParser, function(req,res){

    const plaidID = req.body.plaid_ID;
    const userID = req.body.user;

    //send to server

    testConnection(updatePlaidID);

    function updatePlaidID(){

        bankAccountManager.exchangeToken(plaidID, function(bankAccountError, plaidResult) {
            if (bankAccountError === null){
                //we have successfully exchanged token
                const privateToken = plaidResult;
                connection.query('UPDATE user SET plaid_private_ID = ? WHERE userID = ?', [privateToken, userID], function(sqlError, results, fields){
                    if (sqlError === null){
                        //we have retrieved the key and are now sending a callback and have successfully added the users bank
                        res.status(200).send({"payload":{'success':true},"error":{"errorCode":null, "message":null}});
                    }else{
                        //there is a sql error and we need to return an error
                        res.status(200).send({"payload":{'success':false},"error":{"errorCode":sqlError.code, "message":sqlError.message}});
                    }
                });
            }else{
                //there is a invalid token and we need to return an error
                res.status(200).send({"payload":{'success':false},"error":{"errorCode":bankAccountError.error_code, "message":bankAccountError.error_message}});
            }
        });

    }
});

apiRouter.post('/api/verifyaccount',jsonParser, function(req,res){

    //get the token from the json body
    let token = req.body.token;

    testConnection(verifyAccount)

    function verifyAccount(){

        //query from database to find a verification that matches the one we were given when we went to the site
        //if we don't find one we return that we could not find specified verification
        connection.query('SELECT * FROM verification WHERE token = ?', [token], function(error, results,fields){
            //there is no error
            if (error === null){
                //make sure we have a verification result from the server
                if (results.length === 0) {
                    console.log('bad token');

                    res.status(200).send({"payload":{'success':false},"error":{"errorCode":'INVALID_TOKEN', "message":'this url is invalid'}});
                }else {
                    //we have found the verification object and should now verify the user's account
                    if (results[0].type === 'confirm_account') {
                        // now we need to connect and set the confirmed to equal 1
                        connection.query('UPDATE verification SET confirmed = 1 WHERE token = ?', [token], function(updateError,updateResults,fields){
                            if (error === null){
                                console.log('success');
                                res.status(200).send({"payload":{'success':true},"error":{"errorCode":null, "message":null}});
                            }else{
                                //there was an issue with the second confirm and we need to return an error
                                res.status(200).send({"payload":{'success':false},"error":{"errorCode":updateError.errorCode, "message":updateError.message}})
                            }

                        });

                    }else {
                        res.status(200).send({"payload":{'success':false},"error":{"errorCode":'TOKEN_ERROR', "message":'token type was not confirm_account'}})
                    }
                }
            }else{
                //there was a mysql error and we will return it
                res.status(200).send({"payload":{'success':false},"error":{"errorCode":error.errorCode, "message":error.message}})
            }
        });
    }
});


apiRouter.post('/api/signup', jsonParser, function(req,res){
    let id = shortid.generate();


    let plaintextpass = req.body.password;


    testConnection(signup);

    function signup(){
        bcrypt.hash(plaintextpass, 10, function(err, hash) {
        if (err !== null){
            res.status(200).send({"payload":{"userID":null},"error":{"errorCode":err.code, "message":err.message}});

        }else{
            connection.query('INSERT INTO user (`fullname`, `email`, `password`, `userID`, `date_created`) VALUES (?,?,?,?,current_timestamp());',
                [req.body.fullname,req.body.email,hash,id], function(error,results,fields){
                    if (error === null){
                        res.status(200).send({"payload":{"userID":id},"error":{"errorCode":null, "message":null}});
                    }else{
                        console.log(error);
                        res.status(200).send({"payload":{"userID":null},"error":{"errorCode":error.code, "message":error.message}});
                    }
                })
         }
        });
    }

});

//this function tests the connection with the database and reconnects if we have been disconnected
function testConnection(action){
    connection.ping(function(error){
        //check if the database is responding
        if (error){
            console.error("Error connecting to database: " + error.message);
            //there was an error connecting so we will try to connect again
            connection.connect(function(err){

                if (err !== undefined){
                    //there was an error reconnecting so we will output an error message
                    //I should figure out how to handle this siutation better in the future
                    console.log("Could not connect after attempt to reconnect: " + err.message);
                }else{
                    action();
                }
            })
        }else{
            //no issue here
            action();
        }
    });

}


module.exports = {
    router: apiRouter
};
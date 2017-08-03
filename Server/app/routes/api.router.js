let envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});
let shortid = require('shortid');
let express = require('express');
let apiRouter = express.Router();
let bodyParser = require('body-parser');
let mysql = require('mysql');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let email = require(__dirname + "/../controllers/emailManager.js");
let accountVerification = require(__dirname + "/../controllers/account/accountVerification.js");

//Requires for other routers so we dont have to cluster the app.js
let credsRouter = require(__dirname + "/credentials-api.router.js").router;
apiRouter.use(credsRouter);



let bankAccountManager = require(__dirname + "/../controllers/bankAccountManager.js");

let jsonParser = bodyParser.json();

let pool = mysql.createPool({
    connectionLimit : 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'teller_production_rds'
});

/*
Body: {email:""}
 */
apiRouter.put('/api/requestPasswordReset',jsonParser, function(req,res){

    // we have the email so we should send a request with the link to reset the password

    // email.sendConfirmationEmail('sam.kirkiles@gmail.com', 'http://localhost:4200/verifyaccount/thisisthetesttoken', (err, res) => {
    //     console.log(res);
    //     console.log(err);
    // });

    sendAccountVerificationLink('rJeTN3LS-', (err, res) => {
        console.log(res);
        console.log(err);
    });
});

function sendAccountVerificationLink(user){
    //query all of the verification tokens that match the user
    pool.query("SELECT user.userID, user.email, verification.token, verification.type, verification.confirmed FROM user LEFT JOIN verification ON verification.user = user.userID AND verification.type = 'confirm_account' WHERE user.userID = ?",
    [user],
    function(error, results, fields){
       //here we should have the results
        if (error === null){
            console.log(results[0].userID);
            createVerification(results[0].userID);

            if (results.length === 0){
                //there are no verifications for this account so we should probably generate one
                console.log(results);
            }else if(results[0].token === null){
                console.log(results[0].token);
                let user = results[0].userID;

                // connection.query('',[],function(err,values,cb){
                //
                // });

            } else{
                //we have a verification for this account and we can fetch the token
            }
        }else{
            console.log(error);
            //we have an error and we NEED TO HANDLE IT
        }
    });
}


apiRouter.post('/api/currentuser', jsonParser, function(req,res){
    jwt.verify(req.body.token, 'secret', { algorithm: 'HS256'}, function (err, decoded){
        if (err !== null){
            res.status(200).send({'payload':{'success':true, 'result':err}});
        }else{

        //make sure database is connected and run the function to retrieve current user
            userID = decoded.userID;

            //get the current user from the database and send it
            pool.query('SELECT * FROM user WHERE userID = ?',[userID],function(err, results, fields){

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
    });
});
//
// apiRouter.post('/api/facebookID', jsonParser, function(req,res){
//     const facebookID = req.body.facebookID;
//     const userID = req.body.userID;
//
//     pool.query('UPDATE user SET facebookID=? WHERE userID=?', [facebookID, userID], function(err, results, fields){
//         if (err === null){
//             console.log(results);
//             res.status(200).send({"payload":{'success':true},"error":{"errorCode":null, "message":null}});
//         }else{
//             res.status(200).send({"payload":{'success':false},"error":{"errorCode":err.code, "message":err.message}});
//         }
//     })
// });

apiRouter.post('/api/plaidID', jsonParser, function(req,res){

    const plaidID = req.body.plaid_ID;
    const userID = req.body.user;

    //send to server


    bankAccountManager.exchangeToken(plaidID, function(bankAccountError, plaidResult) {
        if (bankAccountError === null){
            //we have successfully exchanged token
            const privateToken = plaidResult;
            pool.query('UPDATE user SET plaid_private_ID = ? WHERE userID = ?', [privateToken, userID], function(sqlError, results, fields){
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

});

/*
{
    token: (token)
}
 */

apiRouter.post('/api/verifyaccount',jsonParser, function(req,res){

    //get the verification token from the json body
    let token = req.body.token;

    //query from database to find a verification that matches the one we were given when we went to the site
    //if we don't find one we return that we could not find specified verification
    pool.query('SELECT * FROM verification WHERE token = ?', [token], function(error, results,fields){
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
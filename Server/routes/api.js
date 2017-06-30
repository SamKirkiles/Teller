let envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});
let shortid = require('shortid');

let express = require('express');
let apiRouter = express.Router();
let bodyParser = require('body-parser');
let mysql = require('mysql');
let bcrypt = require('bcryptjs');

let jwt = require('jsonwebtoken');

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

    let messageBody = "Here is your requested email reset link";

    let params = {
        Destination:{
            ToAddresses:[
                req.body.email
            ]
        },
        Message: {
            Body: { /* required */
                Html: {
                    Data: messageBody, /* required */
                    Charset: 'UTF-8'
                },
                Text: {
                    Data: messageBody, /* required */
                    Charset: 'UTF-8'
                }
            },
            Subject: { /* required */
                Data: 'Teller Requested Email Reset', /* required */
                Charset: 'UTF-8'
            }

        },
        Source: 'teller@tellerchatbot.com', /* required */
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

    testConnection(query);

    function query() {

        connection.query('SELECT * FROM user WHERE email=?',[email],function(error, results, fields){

        if (results[0] !== undefined){

            bcrypt.compare(password, results[0].password.toString(), function(err, bcryptResponse) {
                console.log(bcryptResponse);
                console.log(err);

                if (bcryptResponse === true){

                    let user = {
                        date_created: results[0].date_created,
                        fullname: results[0].fullname,
                        email: results[0].email,
                        userID: results[0].userID
                    };

                    //the login was successful and we have a user that we have now turned into a stirng

                    jwt.sign({ userID: results[0].userID }, 'secret', { algorithm: 'HS256' }, function(err, token) {
                        
                        if (err === undefined){
                            console.log("there was an error" + err.message);
                        }else{
                            console.log()
                        }

                        res.status(200).send({"payload":{"success":true, "token":token},"error":{"errorCode":null, "message":null}});
                    });

                }else{
                    res.status(200).send({"payload":{"success":false, "token":null},"error":{"errorCode":null, "message":null}});
                }
            });
        }else{
            res.status(200).send({"payload":{"success":false, "token":null},"error":{"errorCode":null, "message":null}});
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

apiRouter.post('/api/signup', jsonParser, function(req,res){
    let id = shortid.generate();

    let plaintextpass = req.body.password;


    testConnection(signup);

    function signup(){
        bcrypt.hash(plaintextpass, 10, function(err, hash) {
        if (err !== undefined){
            res.status(200).send({"payload":{"userID":null},"error":{"errorCode":"HASH_ERROR'", "message":"Could not hash password"}});
            return;
        }else{
            connection.query('INSERT INTO user (`fullname`, `email`, `password`, `userID`, `date_created`) VALUES (?,?,?,?,current_timestamp());',
                [req.body.fullname,req.body.email,hash,id], function(error,results,fields){
                    if (error === null){
                        res.status(200).send({"payload":{"userID":id},"error":{"errorCode":null, "message":null}});
                    }else{
                        console.log(error)
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
}
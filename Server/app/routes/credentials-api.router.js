let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let shortid = require('shortid');
let bcrypt = require('bcryptjs');
let mysql = require('mysql');
let accountVerification = require(__dirname + "/../controllers/account/accountVerification.js");
let emailManager = require(__dirname + "/../controllers/emailManager.js");
let jwt = require('jsonwebtoken');

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
 JSON body - POST -

 {
 email: (email),
 pass: (password)
 }
 */

router.post('/api/signin', jsonParser, function(req,res){

    let email = req.body.email;
    let password = req.body.password;

    console.log('signin pressed');

    //find all results
    connection.query('SELECT user.*, verification.confirmed FROM user LEFT JOIN verification ON verification.user=user.userID WHERE user.email=?;',[email],function(error, results, fields){

        if (results[0].confirmed === 0){
            console.log("Good we didn't let them continue");
            let verifyErrorCode = "NOT_VERIFIED"
            let verifyErrorMessage = "The account was not verified";
            res.status(200).send({"payload":{"success":false, "token":null},"error":{"errorCode":verifyErrorCode,"message":verifyErrorMessage}})
        }else{
            console.log("Why did thhey get let through")
            console.log(results[0].confirmed);
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
        }



    });
});



router.post('/api/signup', jsonParser, function(req,res){
    let id = shortid.generate();


    let fullname = req.body.fullname;
    let email = req.body.email;
    let plaintextpass = req.body.password;

    bcrypt.hash(plaintextpass, 10, function(err, hash) {
        if (err !== null){
            res.status(200).send({"payload":{"userID":null},"error":{"errorCode":err.code, "message":err.message}});

        }else{
            connection.query('INSERT INTO user (`fullname`, `email`, `password`, `userID`, `date_created`) VALUES (?,?,?,?,current_timestamp());',
                [fullname,email,hash,id], function(error,results,fields){
                    if (error === null){
                        //here we want to create a verification if there isnt one for the user and email them the link
                        accountVerification.createVerification(id, function(err, verificationResponse){
                            if (err === null){
                                let sendUrl;
                                if (process.env.NODE_ENV === 'Dev'){
                                    sendUrl = 'http://' + 'localhost:4200' + '/verifyaccount/' + verificationResponse.verificationID;
                                }else{
                                    sendUrl = 'https://' + req.get('host') + '/verifyaccount/' + verificationResponse.verificationID;
                                }

                                console.log(sendUrl);

                                emailManager.sendConfirmationEmail(email, sendUrl, function(err, response){

                                });
                                res.status(200).send({"payload":{"userID":id},"error":{"errorCode":null, "message":null}});
                            }else{
                                res.status(200).send({"payload":{"userID":null},"error":{"errorCode":err.code, "message":err.message}});
                            }
                        });
                    }else{
                        console.log(error);
                        res.status(200).send({"payload":{"userID":null},"error":{"errorCode":error.code, "message":error.message}});
                    }
                })
        }
    });

});


module.exports = {
    router: router
};
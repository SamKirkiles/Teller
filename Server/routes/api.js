let envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});
let shortid = require('shortid');

let express = require('express');
let apiRouter = express.Router();
let bodyParser = require('body-parser');
let mysql = require('mysql');


let jsonParser = bodyParser.json();

var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'teller_production_rds'
})

connection.connect(function(err) {
    if (err !== null) {
        console.error('Error connecting to database: ' + err.message);
    } else {

    }
});

apiRouter.post('/api/signin', jsonParser, function(req,res){

    let email = req.body.email;
    let password = req.body.password;

    connection.query('SELECT * FROM user WHERE email=? AND password=? ',[email, password],function(error, results, fields){
        if (results[0] !== undefined){
            let user = {
                date_created: results[0].date_created,
                fullname: results[0].fullname,
                email: results[0].email,
                userID: results[0].userID
            }

            res.status(200).send({"payload":{"success":true,"user":JSON.stringify(user)},"error":{"errorCode":null, "message":null}});
        }else{
            res.status(200).send({"payload":{"success":false,"user":null},"error":{"errorCode":null, "message":null}});
        }
    })
});

apiRouter.post('/api/signup', jsonParser, function(req,res){
    let id = shortid.generate()
    connection.query('INSERT INTO user (`fullname`, `email`, `password`, `userID`, `date_created`) VALUES (?,?,?,?,current_timestamp());',
        [req.body.fullname,req.body.email,req.body.password,id], function(error,results,fields){
        if (error === null){
            res.status(200).send({"payload":{"userID":id},"error":{"errorCode":null, "message":null}});
        }else{
            console.log(error)
            res.status(200).send({"payload":{"userID":null},"error":{"errorCode":error.code, "message":error.message}});
        }
    })
})




module.exports = {
    router: apiRouter
}
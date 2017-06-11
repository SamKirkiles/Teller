let envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});


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
            res.sendStatus(200);
        }else{
            res.sendStatus(401);
        }
    })



});




module.exports = {
    router: apiRouter
}
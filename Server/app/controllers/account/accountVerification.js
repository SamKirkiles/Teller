let mysql = require('mysql');
let uniqid = require('uniqid')

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



function createVerification(user, cb){

    let userID = user;
    let verificationID = uniqid();

    connection.query("INSERT INTO verification (type, token, user) VALUES ('confirm_account', ?, ?)", [verificationID, userID], function(err,res,fields){
        if (typeof(cb) == 'function') {

            let response = {
                user: userID,
                verificationID: verificationID
            }
            cb(err,response)
        }else{
            console.log("Callback was not a function");
        }
    })
}


module.exports = {
    createVerification:createVerification
}

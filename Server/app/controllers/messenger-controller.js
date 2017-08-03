let request = require("request");
let mysql = require('mysql');

var pool  = mysql.createPool({
    connectionƒLimit : 6,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'teller_production_rds'
});

function verifyMessengerUser(userID, callback){

    callback({
        suceeded: true
    })
    // pool.query('SELECT fullname, userID, facebookID FROM user WHERE facebookID=?', [userID], function(error, result, fields){
    //     if (error) throw error;
    //     else {
    //         if (result.length === 0){
    //             //this user has not yet registered with teller
    //             callback({
    //                 succeeded: false
    //             });
    //         }else{
    //             //there is a user here so we can let them continue.
    //             callback({
    //                 succeeded: true
    //             });
    //         }
    //     }
    // });
}

function handleUnregisteredUser(userID){

    let message = "It looks like you aren't registered with Teller yet. Please visit \n" +
        "https://tellerchatbot.com to get started";

    sendMessage(userID, message, function(){

    });
}

function sendLogOut(recipient, callback){


    var options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        method: "POST",
        qs: {access_token:process.env.FB_MESSENGER_TOKEN},
        json:{
            recipient: {
                id: recipient
            },
            message:{
                attachment:{
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "You need to login to access teller",
                        buttons:[
                            {
                                type: "account_unlink",
                            }
                        ]
                    }
                }
            }
        }
    };

    request(options,function(error,incomingMessage,response){
        console.log(response.error);
        callback()
    });
}

function sendLogin(recipient, callback){

    var login;
    if (process.env.NODE_ENV === "Dev"){
        login = 'https://teller-development-frontend.ngrok.io';
    }else{
        login = 'https://tellerchatbot.com';
    }


    var options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        method: "POST",
        qs: {access_token:process.env.FB_MESSENGER_TOKEN},
        json:{
            recipient: {
                id: recipient
            },
            message:{
                attachment:{
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "You need to login to access teller",
                        buttons:[
                            {
                                type: "account_link",
                                url: login + '/authorize'
                            }
                        ]
                    }
                }
            }
        }
    };

    request(options,function(error,incomingMessage,response){

        callback()
    });
}

function sendMessage(recipient, recipientmessage, callback){
    var options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        method: "POST",
        qs: {access_token:process.env.FB_MESSENGER_TOKEN},
        json:{
            recipient: {
                id: recipient
            },
            message:{
                text: recipientmessage
            }
        }
    };

    request(options,function(error,incomingMessage,response){
        if (!error){
            if (callback){
                callback()
            }
        }
    });
}


module.exports = {
    sendMessage: sendMessage,
    verifyMessengerUser: verifyMessengerUser,
    handleUnregisteredUser: handleUnregisteredUser,
    sendLogin: sendLogin,
    sendLogOut: sendLogOut
};
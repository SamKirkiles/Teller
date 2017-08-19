let request = require("request");
let mysql = require('mysql');

var pool  = mysql.createPool({
    connectionƒLimit : 6,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'teller_production_rds'
});

function verifyMessengerUser(messengerID, callback){

    pool.query('SELECT fullname, userID, messengerID FROM user WHERE messengerID=?', [messengerID], function(error, result, fields){
        if (error) throw error;
        else {
            if (result.length === 0){
                //this user has not yet registered with teller
                callback({
                    user: null,
                    succeeded: false
                });
            }else{
                //there is a user here so we can let them continue.
                callback({
                    user: result[0],
                    succeeded: true
                });
            }
        }
    });
}

function handleUnregisteredUser(userID){

    let message = "It looks like you aren't registered with Teller yet. Please visit \n" +
        "https://tellerchatbot.com to get started";

    sendLogin(userID, function(){

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
                        text: "Sign out from Teller with the button below.",
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

function sendLink(recipient, text, link, linkTitle, callback){
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
                        text: text,
                        buttons:[
                            {
                                "type":"web_url",
                                "url":link,
                                "title":linkTitle,
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
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
                        text: "It looks like you aren't logged in with Teller. Please visit the following link to get started.",
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

function sendRevalidateBankCreds(recipient, callback){
    var url;
    if (process.env.NODE_ENV === "Dev") {
        url = 'https://teller-development-frontend.ngrok.io';
    } else {
        url = 'https://tellerchatbot.com';
    }

    let accountUrl = url + '/account'

    var options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        method: "POST",
        qs: {access_token:process.env.FB_MESSENGER_TOKEN},
        json:{
            recipient: {
                id: recipient
            },
            message:{
                text: "Your bank credentials are no longer valid and you must re enter them. Please visit: \n" + accountUrl
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
    sendLogOut: sendLogOut,
    sendLink: sendLink,
    sendRevalidateBankCreds: sendRevalidateBankCreds
};
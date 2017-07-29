let request = require("request");

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
    sendMessage: sendMessage
};
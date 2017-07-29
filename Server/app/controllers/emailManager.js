let aws = require('aws-sdk');

let ses = new aws.SES({
    region:"us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

/*
Add better auto complete information here later.
Sends a confirmation email to the specified email with the url. Users the emailHeader.html as a template.

callback: function(err, data){}
 */

function sendPasswordResetEmail(email, url, callback){
    let headerURL = __dirname + '/../../views/emailHeader.html';

    let html = require('fs').readFileSync(headerURL, 'utf8');
    let redirectUrl = '<a href="' + url + '">Reset Password</a>'

    let params = {
        Destination:{
            ToAddresses:[
                email
            ]
        },
        Message: {
            Subject: { /* required */
                Data: 'Change Teller Account Password', /* required */
                Charset: 'UTF-8'
            },
            Body: { /* required */
                Html: {
                    Data: html + redirectUrl,
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

    ses.sendEmail(params, callback);

}


function sendConfirmationEmail(email, url, callback){

    let headerURL = __dirname + '/../../views/emailHeader.html';

    var html = require('fs').readFileSync(headerURL, 'utf8');
    var redirectUrl = '<a href="' + url + '">Confirm Account</a>'

    let messageBody = "Here is your requested email reset link";


    let params = {
        Destination:{
            ToAddresses:[
                email
            ]
        },
        Message: {
            Subject: { /* required */
                Data: 'Verify Account With Teller', /* required */
                Charset: 'UTF-8'
            },
            Body: { /* required */
                Html: {
                    Data: html + redirectUrl,
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

    ses.sendEmail(params, callback);

}





module.exports = {
    sendConfirmationEmail: sendConfirmationEmail
};
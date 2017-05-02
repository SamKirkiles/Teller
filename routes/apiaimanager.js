var apiai = require('apiai')

var app = apiai("011e5d4babb0438f91874bcb3e77b70a")

var sendTextRequest = function(text, callback){
    var request = app.textRequest(text, {
        sessionId: 'session'
    });

    request.on('response', function(response) {
        callback(response, null)
    });

    request.on('error', function(error) {
        callback(null, error)
        console.log(error);
    });

    request.end();
}

module.exports = {
    textRequest: sendTextRequest
}
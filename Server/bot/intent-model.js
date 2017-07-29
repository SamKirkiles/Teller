/**
 * Created by samkirkiles on 7/28/17.
 */

/*
The intent class should give us everything we need to process a messsage sent by the bot. We need the user id to send the message back to, the action that the user requested, and maybe just include
the object directly from api.ai or create some sort of wrapper for the data.
 */

class Intent {
    constructor(accountID, messageData, registered){
        this.accountID = accountID;
        this.messageData = messageData;
        this.registered = registered;
    }
}

module.exports = Intent;
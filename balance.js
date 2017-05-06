var plaid = require(__dirname + "/routes/plaid.js")

function checkBalance(accountType, bank, fulfillment, actionIncomlpete, userSandboxID, completion){

    if (actionIncomlpete === true){
        completion(fulfillment)
    }else{
        //we need to continue with what we were doing

        plaid.balance('access-sandbox-69f55d88-526c-48a1-a872-27f5b505d7a0',function(accounts){
            var returnedAccounts = []


            accounts.forEach(function(account) {
                //if the account type is the same as the kind the user wants
                if (account.type === accountType || bank === account.name){
                    returnedAccounts.push(account)
                }else if (accountType === "" && bank === "undefined"){
                    returnedAccounts.push(account)
                }

            }, this);

            var responseString = "Heres your balance rundown: \n \n"

            returnedAccounts.forEach(function(account) {
               var entry = account.name+": $"+ account.balances.current + "\n"
                responseString+=entry
            }, this);

            completion(responseString)

        })

    }
}

module.exports = {
    checkBalance:checkBalance
}
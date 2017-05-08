
var plaid = require(__dirname + "/routes/plaid.js")

/** This function returns a string response in a callback to a given query for a set of banks  
 * @param {string} accountType - Account Type: The type of account to check the balance of
 * @param {string} bank - Bank: the type of bank to use
 * @param {string} fulfillment - Fulfillment: the fulfillment string to use 
 * @param {string} plaidUserID - User ID: the plaid user ID to query the data from the user with
 * @param {function} completion - Completion Block: the completion function called with one arg of string when the query is finished 
*/
function checkBalance(accountType, bank, fulfillment, actionIncomlpete, plaidUserID, completion){

    if (actionIncomlpete === true){
        completion(fulfillment)
    }else{
        //we need to continue with what we were doing
        
        plaid.balance(plaidUserID,function(accounts){
            var returnedAccounts = []


            accounts.forEach(function(account) {
                //if the account type is the same as the kind the user wants
                if (account.type === accountType || bank === account.name){
                    returnedAccounts.push(account)
                }else if (accountType === "" && typeof bank === "undefined"){
                    console.log("we good nigga")
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
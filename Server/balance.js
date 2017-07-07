
var accountManager = require(__dirname + "/app/controllers/bankAccountManager.js");

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
        accountManager.balance(plaidUserID,function(accounts){
            var returnedAccounts = [];


            accounts.forEach(function(account) {
                //if the account type is the same as the kind the user wants
                if (account.type === accountType || bank === account.name){
                    returnedAccounts.push(account)
                }else if (accountType === "" && typeof bank === "undefined"){
                    returnedAccounts.push(account)
                }

            }, this);

            var responseString = "Heres your balance rundown: \n \n";

            returnedAccounts.forEach(function(account) {
               var entry = account.name+": $"+ account.balances.current + "\n";
                responseString+=entry
            }, this);

            completion(responseString)

        })

    }
}

/** This function returns a response in a callback for a set of transactions
 * @param {string} date - date: If the user wants to know a single date
 * @param {string} dateperiod - date period: If the user wants their transactions over a period
 * @param {string} plaidUserID - User ID: the plaid user ID to query the data from the user with
 * @param {function} completion - Completion Block: the completion function called with one arg of string when the query is finished
 * */
function viewTransactions(date, dateperiod, actionIncomplete, plaidUserID, completion){
    console.log("Checking transactions... working...");

    if (date !== ""){
        //we have the date and we can get the transactions
        accountManager.transactions(date, date, plaidUserID, function(err, response){
            if (!response.total_transactions){
                console.log("Couldn't get any transactions")
                completion("You don't have any purchases from this date")
            }else{
                console.log(response.total_transactions);
                completion(response.total_transactions)
            }
        })
    }else if (dateperiod !== ""){
        //we have some transactions here
        accountManager.transactions(dateperiod.substr(0,10),dateperiod.substr(-10),plaidUserID,function(err, response){
            console.log(err);
            if (response !== undefined){
                console.log(response.total_transactions);
                completion(response.total_transactions)

                var responseString = "Here are your purchases: \n \n";
                var transactions = response.transactions;
                transactions.forEach(function(transaction){
                    responseString += (transaction.name + " $" + transaction.amount + "\n")
                });
                completion(responseString)

            }else{
                completion("You don't have any purchases from this date")
            }
        })
    }

    console.log('finished')

}


module.exports = {
    checkBalance:checkBalance,
    viewTransactions: viewTransactions
};
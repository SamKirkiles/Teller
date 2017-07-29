let plaid = require('plaid');

const plaidClient = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments.sandbox
);

function checkBalance(callback){
    console.log("We have checked our balance");
    // plaidClient.getBalance(access_token, function(err, response){
    //     if (err !== null){
    //         console.error(err.error_message)
    //     }else{
    //         callback(response.accounts);
    //     }
    // });

}

module.exports = {
    checkBalance: checkBalance
};
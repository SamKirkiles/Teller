let envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});


var assert = require("assert");

var balance = require(__dirname + "/../balance.js");


describe('Get Balance', function(){
    this.timeout(30000);
    
    //First test case

    it('Should always return a string', function(done){

        balance.checkBalance(
            "credit",
            "Bank of America",
            "This is the fullfillment",
            false,
            'public-sandbox-465c7c1d-9c3b-4a80-9a70-b53cdce6189b',
            function (response){
                assert(typeof response === "string", "Response gave unexpected value");
                done()
            }
        )
    })

});




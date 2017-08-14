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
            'access-sandbox-c4d2b9ff-a609-4753-878e-4ef6f1583594',
            function (response){
                assert(typeof response === "string", "Response gave unexpected value");
                done()
            }
        )
    })

});




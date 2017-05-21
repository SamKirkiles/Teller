var assert = require("assert")
var balance = require(__dirname + "/../balance.js")

describe('Get Balance', function(){
    this.timeout(15000)
    
    //First test case

    it('Should always return a string', function(done){

        balance.checkBalance(
            "credit",
            "Bank of America",
            "This is the fullfillment",
            false,
            'access-sandbox-69f55d88-526c-48a1-a872-27f5b505d7a0',
            function (response){
                assert(typeof response === "string", "Response gave unexpected value")
                done()
            }
        )
    })

})




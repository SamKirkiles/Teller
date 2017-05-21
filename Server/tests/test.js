

var messenger = require(__dirname + "/../routes/messenger.js");
var assert = require("assert") 



describe("Return Hello", function(){
    it('Should return hello',function(done){
        messenger.testFunction(function(value){
            assert(value === "Hello", 'Should return Hello')
            done()
        })
    })
})
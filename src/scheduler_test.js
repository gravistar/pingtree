/**
 * Created with JetBrains WebStorm.
 * User: david
 * Date: 8/11/13
 * Time: 8:53 PM
 * To change this template use File | Settings | File Templates.
 */

var PingTreeModule = require("./ping.js");
var assert = require("assert")
describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
})

// really dumb test
describe('PingTree', function() {
    describe('#emptySchedule()', function() {
        it('should be of length 7', function() {
            assert.equal(7, PingTreeModule.PingTree.emptySchedule().length);
        })
    })
})



/**
 * User: david
 * Date: 8/14/13
 * Time: 5:16 PM
 * Summary:
 *      A sandbox app for playing around with datastore in node.
 */

var Dropbox = require("./datastore.js");
var PingTree = require("./ping.js");

var client = new Dropbox.Client({ uid: '142146546',
        token: 'kvuAWN7bXm0AAAAAAAAAAY6Qai1-WVPFgbaFyA__ba2_C9hXCeT7u7uN0nHjMW5C',
        key: 'lzicyzey114yb0e',
        secret: 'yl9keexb1m84ezf' }
);

client.authenticate();
if (client.isAuthenticated()){
    console.log("WOOT!");

    // get datastore
    client.getDatastoreManager().openDefaultDatastore(function(err, datastore){
        if (err) {
            console.log("Error opening default datastore: " + err);
            return;
        }

        // create tables
        pingTable = datastore.getTable('pings');
        targetTable = datastore.getTable('targets');

        console.log ("Done creating tables");

        // add stuff and get them
        target = targetTable.insert(PingTree.PingTree.buildTarget("target 1", 1, false, " val ", 1, false, new Date()));
        ping = pingTable.insert(PingTree.PingTree.buildPing(target.getId(), 1, new Date()));

        console.log("Done creating records");

        // check to see the records are there
        console.log("all pings " + pingTable.query());
        console.log("all target " + targetTable.query());

        var timeoutCheck = function() {
            console.log("datastore uploading: " + datastore.getSyncStatus().uploading);
            if (datastore.getSyncStatus().uploading) {
                setTimeout(timeoutCheck, 1000);
            } else {
                console.log("closing datastore");
                datastore.close();
            }
        };
        timeoutCheck();
        console.log("after timeout thing");
    });
}

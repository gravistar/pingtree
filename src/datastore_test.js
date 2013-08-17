/**
 * Created with JetBrains WebStorm.
 * User: david
 * Date: 8/13/13
 * Time: 10:54 PM
 * Summary:
 *      Seeing if I can do a test with datastore and mocha.
 *      Will require node to be serving a page and require the user to click the page in
 *      the url in order to run.
 *
 * Note:
 *  To make this work, I had to do the following
 *      - install xhr2 globally
 *      - set the NODE_PATH for this test to be /usr/local/lib/node_modules
 *
 * Unfortunately, this test isn't fully automated. I still have to cut and paste results from the browser and my script.
 * The workflow right now is to run ./get_client_params.sh
 *      I have to get the auth code out of the browser url
 *      Then I have to get the client params out of the script at the end and paste them as arguments to Dropbox.Client
 *
 * The script was implemented following these references:
 *  https://www.dropbox.com/developers/blog/45/using-oauth-20-with-the-core-api
 *  http://stackoverflow.com/questions/18104535/closing-out-dropbox-datastore-api-in-nodejs
 */

// get the required modules
var Dropbox = require("./datastore.js");
var PingTree = require("./ping.js");
var PingUtil = require("./ping_utils.js");
var assert = require("assert");
var DatastoreUtil = require("./datastore_util.js");

var client = new Dropbox.Client({ uid: '142146546',
        token: 'aQrzcaRSZXUAAAAAAAAAAa3mGGoGntbXCBip_CYlb9tg8U92PsarbG1KC4qU4OVa',
        key: 'lzicyzey114yb0e',
        secret: 'yl9keexb1m84ezf' }
);

client.authenticate();
if (client.isAuthenticated()){
    console.log("WOOT!");

    // get datastore
    describe("Dropbox.Datastore", function () {
        it('should be authenticated', function (done) {

            var pingTableName = 'ping-test', targetTableName = 'target-test',
                templateTableName = 'template-test';

            client.getDatastoreManager().openDefaultDatastore(function(err, datastore){

                if (err) {
                    console.log("Error opening default datastore: " + err);
                    return;
                }

                var syncIt = function() {
                    DatastoreUtil.DatastoreUtil.waitForSync(datastore, function(datastore, thunk) {
                        console.log("callback called");
                        thunk();
                    }, undefined, undefined, done);
                };

                var closeIt = function() {
                    DatastoreUtil.DatastoreUtil.waitForSync(datastore, function(datastore, thunk) {
                        datastore.close();
                        thunk();
                    }, undefined, undefined, done);
                };

                // create tables
                var pingTable = datastore.getTable(pingTableName);
                var targetTable = datastore.getTable(targetTableName);
                var templateTable = datastore.getTable(templateTableName);

                // wipe all existing data
                DatastoreUtil.DatastoreUtil.wipe(pingTable);
                DatastoreUtil.DatastoreUtil.wipe(targetTable);
                DatastoreUtil.DatastoreUtil.wipe(templateTable);

                // add stuff and get them
                var target = targetTable.insert(PingTree.PingTree.buildTarget("target 0", 1, false, " val ", 1, false, new Date()));
                var target1 = targetTable.insert(PingTree.PingTree.buildTarget("target 1", 1, false, " val ", 1, true, new Date()));
                var ping = pingTable.insert(PingTree.PingTree.buildPing(target.getId(), 1, new Date()));
                var badPing = pingTable.insert(PingTree.PingTree.buildPing("-1", 1, new Date()));

                var botTemplate = templateTable.insert(PingTree.PingTree.buildTemplate("leaf", [], [target.getId()]));
                var topTemplate = templateTable.insert(PingTree.PingTree.buildTemplate("root", [botTemplate.getId()], [target1.getId()]));

                // result of getting something from the datastore
                var fetched;

                // Get pings of a target
                describe("Target ", function() {
                    describe("#getPings", function() {
                        it ("should contain ping", function () {
                            fetched = pingTable.query({target_id: target.getId()});
                            assert(fetched.length==1);
                            assert(fetched[0].getId() == ping.getId());
                        })
                    })
                })

                // Get the shallow targets of a template
                describe("Template ", function() {
                    describe("#getShallowTargets", function() {
                        it ("should contain target1 only", function(){
                            fetched = DatastoreUtil.DatastoreUtil.bulkGet(targetTable, topTemplate.get("targets"));
                            assert(fetched.length==1);
                            assert(fetched[0].getId() == target1.getId());
                        })
                    })
                })

                // Get the deep targets of a template
                describe("Template ", function() {
                    describe("#getDeepTargets", function() {
                        it ("should contain both target and target1", function() {
                            fetched = PingUtil.PingUtils.allTargets(topTemplate, templateTable, targetTable);
                            assert(fetched.length==2);
                            assert(fetched[0].getId() == target1.getId());
                            assert(fetched[1].getId() == target.getId());
                        })
                    })
                })


                // doesn't really matter when we call this since it's async...
                syncIt();
            });
        })
    })
}



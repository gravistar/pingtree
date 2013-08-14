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
 *
 *  Just see this
 *  https://www.dropbox.com/developers/blog/45/using-oauth-20-with-the-core-api
 *  And follow this:
 *      http://stackoverflow.com/questions/18104535/closing-out-dropbox-datastore-api-in-nodejs
 */

// get the required modules
var Dropbox = require("./datastore.js");
var assert = require("assert");
var DROPBOX_APP_KEY = 'lzicyzey114yb0e';

var client = new Dropbox.Client({ key: DROPBOX_APP_KEY});

//client.authenticate();



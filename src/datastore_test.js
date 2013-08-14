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
var assert = require("assert");

var client = new Dropbox.Client(
    { uid: '142146546',
        token: '6b0t0Cany2wAAAAAAAAAAcmnVd9r4lyOtv7-hYD738IJrW0j7WFS6Yq-SDdq4ErD',
        key: 'lzicyzey114yb0e',
        secret: 'yl9keexb1m84ezf' }
);

client.authenticate();
if (client.isAuthenticated()){
    console.log("WOOT!");
}



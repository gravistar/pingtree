/**
 * User: david
 * Date: 8/13/13
 * Time: 6:17 PM
 * Summary:
 *      Library functions for interacting with the Dropbox Datastore API.
 *      Here's my policy for dealing with the api.
 *      The tutorial seems to suggest you want to do a Record.set() whenever
 *      you want a change to the property of a Record to be sync'd.
 *
 *      The way I've laid things out is that the things that are created the most
 *      (pings) are actually immutable.  So set shouldn't be needed for these.
 *
 *      I've toyed with the idea of making targets immutable, but I've decided that
 *      the faster route might just be to make everything >= Target immutable.
 */


var DataStoreUtil = {

    insertAndId : function(recordInfo) {


    }


};
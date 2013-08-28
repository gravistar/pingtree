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
 *      the faster route might just be to make everything >= Target mutable.
 */


var DatastoreUtil = {
    /**
     * A function which will wait a maximum number of times for the datastore to finish syncing.
     * @param datastore
     *      datastore to wait on
     * @param poll
     *      amt of time to wait between checking sync status (ms)
     * @param maxPoll
     *      maximum number of times to poll
     * @param callback
     *      should be an operation on the datastore. is this enough? may need a thunk...this method
     *      is getting gross.
     * @param thunk
     *      whatever else the cb needs...
     */
    waitForSync : (function(){
        var pollCount = 0, defaultPoll = 1000, defaultMaxPolls = 10;
        // Actual returned method here
        var waitForSyncHelper = function(datastore, callback, poll, maxPoll, thunk) {
            poll = typeof poll !== 'undefined' ? poll : defaultPoll;
            maxPoll = typeof maxPoll !== 'undefined' ? maxPoll : defaultMaxPolls;
            if (datastore.getSyncStatus().uploading && pollCount < maxPoll) {
                console.log("datastore uploading: " + datastore.getSyncStatus().uploading);
                pollCount += 1;
                setTimeout(waitForSyncHelper, poll, datastore, callback, poll, maxPoll, thunk);
            } else {
                console.log("max poll: " + maxPoll);
                console.log("datastore uploading: " + datastore.getSyncStatus().uploading);
                callback(datastore, thunk);
            }
        };
        return waitForSyncHelper;
    }()),

    /**
     * @param table
     *      datastore table
     * @param record_ids
     *      Datastore.List
     * @returns {Array}
     *      Array of records. no nulls
     */
    bulkGet : function(table, record_ids) {
        var ret = [], record;
        for (var i=0; i<record_ids.length(); i+=1) {
            record = table.get(record_ids.get(i));
            if (record)
                ret.push(record);
        }
        return ret;
    },

    /**
     * Deletes all records in the table
     * @param table
     */
    wipe : function(table) {
        var allRecords = table.query(), record;
        // allIds is a javascript array of records
        for (var i=0; i<allRecords.length; i+=1) {
            console.log("wiping " + allRecords[i].getId());
            allRecords[i].deleteRecord();
        }
    },

    /**
     * Gets the unique set of parent records, assuming each record
     * in records has a parent_id.
     * @param record Array[Datastore.Record]
     */
    parentSet : function(records) {
        var ret = [], i, parent_id;
        for (i=0; i<records.length; i+=1) {
            parent_id = records[i].get('parent_id');
            if (ret.indexOf(parent_id) === -1)
                ret.push(parent_id);
        }
        return ret;
    }
}
exports.DatastoreUtil = DatastoreUtil;

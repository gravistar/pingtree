/**
 * User: david
 * Date: 8/8/13
 * Time: 10:52 PM
 *
 * Summary:
 *      I've laid out the schema description here.  It's been designed with the Datastore api in
 *      mind, in particular around the .query() method Datastore.Table.
 *
 *      Unfortunately, .query() doesn't support collection filtering (ie. find all records whose field F
 *      contains x where F is an array).  I suppose a workaround is to create a field F' whose key
 *      is the stringified x and the value of that key is a boolean.
 *
 *      If I want to have certain templates appear on certain days, I will probably have to use the
 *      second approach:
 *
 *      Something like:
 *          Schedule : {
 *              '0' : true      // sunday
 *              '1' : false     // monday
 *              ...
 *              '6' : true      // saturday
 *          }
 *
 * Schema:
 *
 * Summary: Analogous to dirs in a filesystem.  Just a way of organizing targets.
 * Template : {
 *      name : String.
 *      parentId : String. id of the parent template. set to the magic string NO_PARENT if it's a root.
 *      createTime : Date.
 *      expanded : boolean. True if this was last expanded in the UI
 * }
 *
 * Summary: A simple goal that I want to reach.  I think a surprising number of recurring goals can be
 *  rephrased in this framework.  Consider 5 sets of 5 reps at 100 lbs for incline bench.  The most natural
 *  way to rephrase this is
 *      {
 *          val : 100
 *          valUpperBound : false
 *          count : 5
 *          countUpperBound : false
 *      }
 *  Then each time you do a set of 5, ping this target with the weight.  Unfortunately, there's a loss of information
 *  because you might have done 4 reps of 100 and want to record that.  Right now I want the targets to be strictly
 *  all or nothing. Not only will it be more disciplinary, but as a bonus it should make the data less ambiguous
 *  when doing statistics.
 *
 * Target : {
 *      name : String.
 *      parentId : String. what template this belongs to (provided by datastore)
 *      val : double. the target value.
 *      valUpperBound : boolean. true if val is an upper bound. otherwise, it's a lower bound.
 *      valName : String. name of the val being tracked.
 *      count : long. the target count.
 *      countUpperBound : boolean. true if count is an upper bound. otherwise, it's a lower bound.
 *      createTime : Date.
 *      expanded : boolean. true if this was last expanded in the UI
 * }
 *
 * I do have an idea for a more general target, though.  It looks like this:
 * GeneralTarget : {
 *      nameFn : String. a simple expression like "incline bench $count x $val0" that will be
 *          parsed to produce the name. Meant to be used on this.
 *      parentId : String. what template this belongs to (provided by datastore)
 *      vals : Array of double. the target values which user has defined some semantics on.
 *      valUpperBounds : Array of boolean. Same size as vals.  i'th is true if i'th entry in vals
 *          is an upper bound. otherwise, it's a lower bound.
 *      valNames : Array of String.
 *      count : long. the target count.
 *      countUpperBounds. boolean. true if count is an upper bound. otherwise, it's a lower bound.
 *      createTime : Date.
 *      expanded : boolean. True if this was last expanded in the UI
 * }
 *
 * Summary: An attempt at a target that I want recorded.  Can be an overshoot or an undershoot. Pings are immutable,
 *          but they are deletable.  So if I make a mistake, I'll delete the bad one and replace it with a fixed one.
 * Ping : {
 *      parentId : String. what target this is for (provided by the datastore).
 *      val : double. the numerical value associated with this ping.
 *      createTime : Date. creation time.
 *      createDay : Date. createTime set to midnight. uniquely identifies up to day of creation. this is here
 *          because .query() doesn't support comparison filtering.
 * }
 */

//var DatastoreUtil = require('./datastore_utils.js');
var PingTree = (function() {
    var ret = {}, NO_PARENT = "NO_PARENT";
    var dayMap = {
        '0' : "Sunday",
        '1' : "Monday",
        '2' : "Tuesday",
        '3' : "Wednesday",
        '4' : "Thursday",
        '5' : "Friday",
        '6' : "Saturday"
    };

    function buildTemplate (name, parentId) {
        return {
            name : name,
            parentId : parentId
        };
    };

    function buildTarget(name, parentId, val, valUpperBound, valName,
                         count, countUpperBound, createTime) {
        return {
            name : name,
            parentId : parentId,
            val : val,
            valUpperBound: valUpperBound,
            valName : valName,
            count : count,
            countUpperBound : countUpperBound,
            createTime : createTime,
            expanded : false
        };
    };

    function buildPing(parentId, val, createTime) {
        return {
            parentId: parentId,
            val : val,
            createTime : createTime,
            createDay : PingUtil.roundDay(createTime)
        };
    };

    ret.buildTemplate = buildTemplate;
    ret.buildTarget = buildTarget;
    ret.buildPing = buildPing;
    ret.NO_PARENT = NO_PARENT;
    return ret;
})();

exports.PingTree = PingTree;
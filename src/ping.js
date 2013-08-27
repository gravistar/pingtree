/**
 * User: david
 * Date: 8/8/13
 * Time: 10:52 PM
 *
 * Summary:
 *      An extensive description of the schema is given here.  This file contains
 *      methods for doing basic manipulations (CRUD type stuff) with the different
 *      data structures.
 *
 *      Screw it, I've decided that these will be dependent on the datastore api.
 *
 * Schema:
 *
 * Summary: Manages what should templates should be displayed on what day
 * Scheduler : {
 *      '0': global template for Sunday
 *      .
 *      .
 *      .
 *      '6': global template for Saturday
 *      reset_time : long. the hour/minute (in ms)
 * }
 *
 * Summary: Analogous to dirs in a filesystem.  Just a way of organizing targets.
 * Template : {
 *      name : String.
 *      parent_id : String. Id of the parent template. null if it has no parent.
 *      subtemplates : Array[String]. Just the subtemplates. Interior nodes of this tree.
 *      targets : Array[String]. Actual targets that should be shown. Leaves of this tree.
 *      expanded : boolean. True if this was last expanded in the UI
 * }
 *
 * Summary: A simple goal that I want to reach.  I think a surprising number of recurring goals can be
 *  rephrased in this framework.  Consider 5 sets of 5 reps at 100 lbs for incline bench.  The most natural
 *  way to rephrase this is
 *      {
 *          val : 100
 *          val_upper_bound : false
 *          count : 5
 *          count_upper_bound : false
 *      }
 *  Then each time you do a set of 5, ping this target with the weight.  Unfortunately, there's a loss of information
 *  because you might have done 4 reps of 100 and want to record that.  Right now I want the targets to be strictly
 *  all or nothing. Not only will it be more disciplinary, but as a bonus it should make the data less ambiguous
 *  when doing statistics.
 *
 * Target : {
 *      name : String.
 *      parent_id : String. what template this belongs to
 *      val : double. the target value.
 *      val_upper_bound : boolean. true if val is an upper bound. otherwise, it's a lower bound.
 *      val_name : String.
 *      count : long. the target count.
 *      count_upper_bound : boolean. true if count is an upper bound. otherwise, it's a lower bound.
 *      create_time : long.
 *      expanded : boolean. True if this was last expanded in the UI
 * }
 *
 * I do have an idea for a more general target, though.  It looks like this:
 * GeneralTarget : {
 *      nameFn : String. a simple expression like "incline bench $count x $val0" that will be
 *          parsed to produce the name. Meant to be used on this.
 *      vals : Array of double. the target values which user has defined some semantics on.
 *      val_upper_bounds : Array of boolean. Same size as vals.  i'th is true if i'th entry in vals
 *          is an upper bound. otherwise, it's a lower bound.
 *      val_names : Array of String.
 *      count : long. the target count.
 *      count_upper_bound. boolean. true if count is an upper bound. otherwise, it's a lower bound.
 *      create_time : long.
 *      expanded : boolean. True if this was last expanded in the UI
 * }
 *
 * Summary: An attempt at a target that I want recorded.  Can be an overshoot or an undershoot. Pings are immutable,
 *          but they are deletable.  So if I make a mistake, I'll delete the bad one and replace it with a fixed one.
 * Ping : {
 *      parent_id : String. what target this is for (provided by the datastore)
 *      val : double. the numerical value associated with this ping
 *      timestamp : Date. creation time
 * }
 */

var PingTree = (function() {
    var ret = {}, NO_PARENT = "NO_PARENT";

    // makes empty templates for each and store the id
    function buildScheduler (templateTable) {
        var ret = {
            'reset_time' : 0 // midnight
        };
        var dayMap = {
            '0' : "Sunday",
            '1' : "Monday",
            '2' : "Tuesday",
            '3' : "Wednesday",
            '4' : "Thursday",
            '5' : "Friday",
            '6' : "Saturday"
        };
        // create new global templates for each day and add the id to scheduler
        for (var i=0; i<7; i+=1)
            ret[i] = templateTable.insert(buildTemplate(dayMap[i], NO_PARENT)).getId();

        ret.expanded = false;

        return ret;
    };

    function buildTemplate (name, parent_id) {
        return {
            name : name,
            parent_id : parent_id
        };
    };

    function buildTarget(name, parent_id, val, val_upper_bound, val_name,
                         count, count_upper_bound, create_time) {
        return {
            name : name,
            parent_id : parent_id,
            val : val,
            val_upper_bound: val_upper_bound,
            val_name : val_name,
            count : count,
            count_upper_bound : count_upper_bound,
            create_time : create_time,
            expanded : false
        };
    };

    function buildPing(parent_id, val, create_time) {
        return {
            parent_id: parent_id,
            val : val,
            create_time : create_time
        };
    };

    ret.buildScheduler = buildScheduler;
    ret.buildTemplate = buildTemplate;
    ret.buildTarget = buildTarget;
    ret.buildPing = buildPing;
    ret.NO_PARENT = NO_PARENT;
    return ret;
})();

exports.PingTree = PingTree;
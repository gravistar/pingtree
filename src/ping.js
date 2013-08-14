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
 *      schedule : a 2D Array of length 7. [0...6] correspond to [Sunday...Monday].
 *          Elements of this array are arrays of template_id's that will be shown for
 *          the day
 *      reset_time : long. the hour/minute (in ms)
 * }
 *
 * Summary: Analogous to dirs in a filesystem.  Just a way of organizing targets.
 * Category : {
 *      name : String.
 *      children : an Array. Just the subcategories. Interior nodes of this tree.
 *      targets : an Array. Actual targets that should be shown. Leaves of this tree.
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
 *      val : double. the target value.
 *      val_upper_bound : boolean. true if val is an upper bound. otherwise, it's a lower bound.
 *      val_name : String.
 *      count : long. the target count.
 *      count_upper_bound : boolean. true if count is an upper bound. otherwise, it's a lower bound.
 *      create_time : long.
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
 * }
 *
 * Summary: An attempt at a target that I want recorded.  Can be an overshoot or an undershoot. Pings are immutable,
 *          but they are deletable.  So if I make a mistake, I'll delete the bad one and replace it with a fixed one.
 * Ping : {
 *      target_id : what target this is for (provided by the datastore)
 *      val : double. the numerical value associated with this ping
 *      timestamp : creation time
 * }
 */

var PingTree = {
    /**
     * Builds the scheduler. This should be a singleton.
     * @param resetTime
     * @returns {{getSchedule: Function, getResetTime: Function}}
     */
    emptySchedule : function() {
        var schedule = [], numDays = 7;
        for (var i = 0; i < numDays; i += 1)
            schedule.push([])
        return schedule;
    },

    /**
     * Creates a new scheduler. Defaults to oldScheduler if provided.
     * Otherwise, defaults to basic empty scheduler.
     * This should be private.
     *
     * @param schedule
     * @param resetTime
     * @param oldScheduler
     * @returns {{getSchedule: Function, getResetTime: Function}}
     */
    buildScheduler : function(schedule, resetTime, oldScheduler) {
        return {
            getSchedule : function() {
                return schedule ||
                    (oldScheduler || oldScheduler.getSchedule()) || emptySchedule();
            },
            getResetTime : function() {
                return resetTime ||
                    (oldScheduler || oldScheduler.getResetTime()) || 0;
            }
        };
    },

    /**
     * Builds the initial scheduler, which is empty but properly set up.
     * @returns {*}
     */
    initScheduler : function() {
        return buildScheduler();
    },

    changeResetTime : function (resetTime, oldScheduler) {
        return buildScheduler(oldScheduler.getSchedule(),
            resetTime,
            oldScheduler);
    },

    addTarget : function(targetId, day, oldScheduler) {
        // just need 1 level copy
        var updatedSchedule = scheduler.getSchedule().slice(0);
        updatedSchedule[day].push(targetId);
        return buildScheduler(updatedSchedule,
            oldScheduler.getResetTime(),
            oldScheduler);
    },

    deleteTarget : function(targetId, day, oldScheduler) {
        // just need 1 level copy
        var updatedSchedule = scheduler.getSchedule().slice(0),
            updatedDaySchedule = [];
        // replace this with some functional thing
        for (var i = 0; i < updatedSchedule.length; i += 1) {
            if (updatedSchedule[i] !== targetId)
                updatedDay.push(updatedSchedule[i])
        }
        updatedSchedule[day] = updatedDaySchedule;
        return buildScheduler(updatedSchedule,
            oldScheduler.getResetTime(),
            oldScheduler);
    },

    /**
     *  Ping : {
     *     target_id : what target this is for (provided by the datastore)
     *     val : double. the numerical value associated with this ping
     *     timestamp : creation time
     *  }
     *
     *  Immutable
     */
    buildPing : function(targetId, val, createTime) {
        return {
            getTargetId : function() {
                return targetId;
            },
            getVal : function() {
                return val;
            },
            getCreateTime : function() {
                return createTime;
            }
        }
    },

    /**
     * Immutable
     * @param val
     * @param upperBound
     * @param createTime
     * @returns {{getVal: Function, getUpperBound: Function, getCreateTime: Function}}
     */
    buildTarget : function(val, upperBound, createTime) {
        return {
            getVal : function() {
                return val;
            },
            getUpperBound : function() {
                return upperBound;
            },
            getCreateTime : function() {
                return createTime;
            }
        };
    }
    // Datastore Interaction
};

exports.PingTree = PingTree;
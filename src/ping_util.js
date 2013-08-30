/**
 * User: david
 * Date: 8/17/13
 * Time: 3:17 PM
 * Summary:
 *      Utilities for handling the objects
 */

//var DatastoreUtil = require("./datastore_util.js");
var PingUtil = (function() {
    /**
     * @param Date. time to round.
     * @returns Date. the date rounded to its midnight time.
     */
    var roundDay = function(time) {
        var tmp = new Date(time);
        tmp.setHours(0);
        tmp.setMinutes(0);
        tmp.setSeconds(0);
        tmp.setMilliseconds(0);
        return tmp;
    };

    // really need map/reduce...

    var allTargets = (function(){
        var allTargetsHelper = function(template, templateTable, targetTable) {
            var children, ret, curChild;
            ret = DatastoreUtil.bulkGet(targetTable, template.get('targets'));
            children = DatastoreUtil.bulkGet(templateTable, template.get('children'));
            for (var i=0; i<children.length; i+=1){
                curChild = children[i];
                ret = ret.concat(allTargetsHelper(curChild, templateTable, targetTable));
            }
            return ret;
        }
        return allTargetsHelper;
    }());

    var ret = {};

    ret.roundDay = roundDay;
    ret.allTargets = allTargets;
    return ret;
})();

exports.PingUtil = PingUtil;
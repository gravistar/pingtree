/**
 * User: david
 * Date: 8/17/13
 * Time: 3:17 PM
 * Summary:
 *      Utilities for handling the objects
 */

var DatastoreUtil = require("./datastore_util.js");
var PingUtils = {

    // really need map/reduce...

    onDeepTargets : function(template, templateTable, targetTable, callback) {
    },

    allTargets : (function(){
        var allTargetsHelper = function(template, templateTable, targetTable) {
            var children, ret, curChild;
            ret = DatastoreUtil.DatastoreUtil.bulkGet(targetTable, template.get('targets'));
            children = DatastoreUtil.DatastoreUtil.bulkGet(templateTable, template.get('children'));
            for (var i=0; i<children.length; i+=1){
                curChild = children[i];
                ret = ret.concat(allTargetsHelper(curChild, templateTable, targetTable));
            }
            return ret;
        }
        return allTargetsHelper;
    }())

};

exports.PingUtils = PingUtils;
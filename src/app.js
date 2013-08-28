/**
 * Created with JetBrains WebStorm.
 * User: david
 * Date: 8/17/13
 * Time: 10:10 PM
 *  Summary:
 *      First stab at the app
 *
 *      Requires:
 *          ./ping.js
 *          ./ping_utils.js
 *          ./datastore_util.js
 */

// Insert your Dropbox app key here:
var DROPBOX_APP_KEY = 'lzicyzey114yb0e';

// Exposed for easy access in the browser console.
var client = new Dropbox.Client({key: DROPBOX_APP_KEY});
var taskTable;

$(function () {
    // constants
    var pingTableName = "pings";
    var targetTableName = "targets";
    var templateTableName = "templates";
    var schedulerTableName = "scheduler";
    var schedulerId = "0xCAFEBABE";

    // utility methods

    // Insert a new task record into the table.
    function insertTask(text) {
        taskTable.insert({
            taskname: text,
            created: new Date(),
            completed: false
        });
    }

    // The login button will start the authentication process.
    $('#loginButton').click(function (e) {
        e.preventDefault();
        // This will redirect the browser to OAuth login.
        client.authenticate();
    });

    // Try to finish OAuth authorization.
    client.authenticate({interactive:false}, function (error) {
        if (error) {
            alert('Authentication error: ' + error);
        }
    });

    if (client.isAuthenticated()) {
        // Client is authenticated. Display UI.
        $('#loginButton').hide();
        $('#main').show();

        var pingTable, targetTable, templateTable, schedulerTable;
        client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
            if (error) {
                alert('Error opening default datastore: ' + error);
            }

            // get the tables
            pingTable = datastore.getTable(pingTableName);
            targetTable = datastore.getTable(targetTableName);
            templateTable = datastore.getTable(templateTableName);
            schedulerTable = datastore.getTable(schedulerTableName);

            // clear all the stuff (just testing)
            DatastoreUtil.wipe(pingTable);
            DatastoreUtil.wipe(targetTable);
            DatastoreUtil.wipe(templateTable);
            DatastoreUtil.wipe(schedulerTable);

            // get the scheduler or make it if it doesn't exist
            var scheduler = schedulerTable.getOrInsert(schedulerId, PingTree.buildScheduler(templateTable));

            // get the day
            var date = new Date();
            var day = date.getDay();
            var todayTemplateId = scheduler.get(day);
            var todayTemplate = templateTable.get(todayTemplateId);

            // delete this later:
            var botTemplate = templateTable.insert(PingTree.buildTemplate("leaf", todayTemplate.getId()));

            var target = targetTable.insert(PingTree.buildTarget("target 0", botTemplate.getId(), 1, false, " val 0", 1, false, new Date()));
            var target1 = targetTable.insert(PingTree.buildTarget("target 1", todayTemplate.getId(), 2, false, " val 1", 1, true, new Date()));
            pingTable.insert(PingTree.buildPing(target.getId(), 1, new Date()));

            DatastoreUtil.waitForSync(datastore, function(){
                // render this shit
                var $mainlist = $('<ul>');
                $mainlist.append(renderTemplate(todayTemplate));
                $('#main').append($mainlist);
                addListeners();
                addRecordsChangedListeners(datastore);
            });

        });
    }

    /**
     * @param template
     *      A Datastore.Record for a template. Belongs to templateTable.
     * @returns {*|jQuery}
     *      A jquery li element for template
     */
    function renderTemplate(template) {
        var id = template.getId(), name = template.get('name');
        var templateData = {
            id: id,
            name: name
        };
        var $template = ich.template(templateData);
        var i;

        // render the subtemplates and append
        var $subtemplates = $template.children('.subtemplates');
        $subtemplates.empty();
        var subtemplates = templateTable.query({parent_id : id});

        for (i=0; i<subtemplates.length; i+=1)
            $subtemplates.append(renderTemplate(subtemplates[i]));

        var $targets = $template.children('.targets');
        $targets.empty();
        var targets = targetTable.query({parent_id : id});

        for (i=0; i<targets.length; i+=1)
            $targets.append(renderTarget(targets[i]));

        return $template.append(renderTemplateForm()).append(renderTargetForm());
    }

    /**
     * Fill in the following:
     *      name of the template.
     *
     * Has the following buttons:
     *      Submit - creates a new Template record.
     *      Delete - gets rid of this form.
     * @returns {*|jQuery}
     *
     */
    function renderTemplateForm() {
        return ich.template_form();
    }

    /**
     * Fill in the following:
     *      name of the value to track.
     *      the target value.
     *      whether the target value is an upper bound (checkbox).
     *      whether the count is an upper bound (checkbox).
     *
     * Has the following buttons:
     *      Submit - creates a new Target record.
     *      Delete - gets rid of this form.
     * @returns {*|jQuery}
     *
     */
    function renderTargetForm() {
        return ich.target_form();
    }

    /**
     * @param valName
     *      String. The name of the value (ie. calories, weight)
     * @param defaultVal
     *      Double.
     * @returns {*}
     *      jquery li element which has form for creating a new ping
     */
    function renderPingForm(valName, targetVal) {
        var pingFormData = {
            valName: valName,
            targetVal: targetVal
        };
        return ich.ping_form(pingFormData);
    }

    /**
     * @param ping
     *      Datastore.Record for ping. Belongs to pingTable
     * @returns {*|jQuery}
     *      jquery li element for a ping which has its info and a delete button
     */
    function renderPing(ping) {
        var pingData = {
            id : ping.getId(),
            val : ping.get('val'),
            timestamp : ping.get('timestamp')
        };
        return ich.ping(pingData);
    }

    /**
     * @param target
     *      Datastore.Record for a target. Comes from targetTable.
     * @returns {*}
     *      jquery li element for a target. contains a list of all pings for this
     *      target as well as a pingform which is used to ping the target.
     */
    function renderTarget(target) {
        var id = target.getId();
        var targetData = {
            id : target.getId(),
            val : target.get('val'),
            valName : target.get('val_name'),
            count : target.get('count'),
            name : target.get('name')
        };
        var i;

        var $target = ich.target(targetData);

        var pings = pingTable.query({parent_id : id});
        var $pings = $target.children('.pings');
        $pings.empty();

        for (i=0; i<pings.length; i+=1)
            $pings.append(renderPing(pings[i]));

        return $target.append(renderPingForm(target.get('val_name'), target.get('val')));
    }

    function addRecordsChangedListeners(datastore) {
        datastore.recordsChanged.addListener(rcPingsChangedCb);
    }

    /**
     *
     * @param rcEvent
     */
    function rcPingsChangedCb(rcEvent) {
        console.log("callback invoked!!");
        var changedPings = rcEvent.affectedRecordsForTable(pingTable), changedTargetIds = [];
        var i, parent_id, changedTarget;

        // get the affected target ids
        for (i=0; i<changedPings.length; i+=1) {
            parent_id = changedPings[i].get('parent_id');
            if ($.indexOf(parent_id, changedTargetIds))
                changedTargetIds.push(parent_id);
        }

        // render the affected target ids
        for (i=0; i<changedTargetIds.length; i+=1) {
            changedTarget = targetTable.get(changedTargetIds[i]);
            $('#' + changedTarget.getId()).replaceWith(renderTarget(changedTarget));
        }
    }

    /**
     * Registers all the DOM listeners. Should be called whenever the datastore is changed.
     */
    function addListeners() {
        $('button.ping_add').click(pingAddCb);
    }

    /**
     * Callback for the ping_add button. Creates a new ping.
     * @param e
     */
    function pingAddCb(e) {
        e.preventDefault();
        var $target = $(this).closest('.target');
        var $parent = $(this).parent();
        var parent_id = $target.attr('id'), val = $parent.find("input").val(), createTime = new Date();
        var ping = PingTree.buildPing(parent_id, val, createTime);
        console.log("building ping! parent_id: " + parent_id + " val: " + val + " create: " + createTime);
        pingTable.insert(PingTree.buildPing(parent_id, val , createTime));
    }

    function addTargetListeners() {
        var parent_id = $('button.ping_add').parents('li').attr('id');
        targetTable.insert(PingTree.buildTarget());

    }

    function addTemplateListeners() {

    }
});

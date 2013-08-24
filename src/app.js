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

    // updateList will be called every time the table changes.
    function updateList(rootTemplate) {
        $('#root-template').empty();


        var records = taskTable.query();

        // Sort by creation time.
        records.sort(function (taskA, taskB) {
            if (taskA.get('created') < taskB.get('created')) return -1;
            if (taskA.get('created') > taskB.get('created')) return 1;
            return 0;
        });

        // Add an item to the list for each task.
        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            $('#tasks').append(
                renderTask(record.getId(),
                    record.get('completed'),
                    record.get('taskname')));
        }

        addListeners();
        $('#newTask').focus();
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
            var i;

            // delete this later:
            var target = targetTable.insert(PingTree.buildTarget("target 0", 1, false, " val ", 1, false, new Date()));
            var target1 = targetTable.insert(PingTree.buildTarget("target 1", 1, false, " val ", 1, true, new Date()));
            var ping = pingTable.insert(PingTree.buildPing(target.getId(), 1, new Date()));

            var botTemplate = templateTable.insert(PingTree.buildTemplate("leaf", [], [target.getId()]));

            var todayTargets = todayTemplate.get('targets');
            var todayTemplates = todayTemplate.get('subtemplates');

            todayTargets.push(target1.getId());
            todayTemplates.push(botTemplate.getId());
            todayTemplate.set('targets', todayTargets.toArray());
            todayTemplate.set('subtemplates', todayTemplates.toArray());

            // render this shit
            var $mainlist = $('<ul>');
            $mainlist.append(renderTemplate(todayTemplate));
            $('#main').append($mainlist);
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
        var $ret = $('<li>').attr('id', id).addClass('template').text(name);
        var i;

        var $subelements = $('<ul>');

        var subtemplateIds = template.get('subtemplates'), subtemplateId,
            subtemplate;

        // render the subtemplates and append
        for (i=0; i<subtemplateIds.length(); i+=1) {
            subtemplateId = subtemplateIds.get(i);
            subtemplate = templateTable.get(subtemplateId);
            $subelements.append(renderTemplate(subtemplate));
        }

        var targetIds = template.get('targets'), targetId, target;

        // render the targets and append
        for (i=0; i<targetIds.length(); i+=1) {
            targetId = targetIds.get(i);
            target = targetTable.get(targetId);
            $subelements.append(renderTarget(target));
        }

        return $ret.append($subelements);
    }

    /**
     * @param valName
     *      String. The name of the value (ie. calories, weight)
     * @param defaultVal
     *      Double.
     * @returns {*}
     *      jquery li element which has form for creating a new ping
     */
    function renderPingForm(valName, defaultVal) {
        var $ret = $('<form>').addClass('pingform').text(valName + ': ');
        var $input = $('<input>').attr('type', 'text')
            .attr('placeholder', defaultVal)
            .attr('name', 'value');
        var $button = $('<button>').addClass('pingform-sub').html('&plus;').attr('type', 'submit');
        return $('<li>').append($ret).append($input).append($button);
    }

    /**
     * @param ping
     *      Datastore.Record for ping. Belongs to pingTable
     * @returns {*|jQuery}
     *      jquery li element for a ping which has its info and a delete button
     */
    function renderPing(ping) {
        var id = ping.getId(), val = ping.get('val'), timestamp = ping.get('timestamp');
        var $ret = $('<li>').attr('id', id).text(val + ' time: ' + timestamp);
        var $delButton = $('<button>').addClass('ping-delete').html('&times;');
        return $ret.append($delButton);
    }

    /**
     * @param target
     *      Datastore.Record for a target. Comes from targetTable.
     * @returns {*}
     *      jquery li element for a target. contains a list of all pings for this
     *      target as well as a pingform which is used to ping the target.
     */
    function renderTarget(target) {
        var id = target.getId(), val = target.get('val'), valName = target.get('val_name'),
            count = target.get('count'), name = target.get('name');
        var $ret = $('<li>').attr('id', id).addClass('target').addClass('target-info')
            .text('(name: ' + name + ') ' +
                '(' + valName + ': ' + val + ')' +
                ' (target pings: ' + count + ')');
        var $delButton = $('<button>').addClass('target-delete').html('&times;');

        var $subelements = $('<ul>');

        // fetch all pings which belong to this target
        var pings = pingTable.query({'target_id' : id});
        var ping;

        for (var i=0; i<pings.length; i+=1) {
            ping = pings[i];
            $subelements.append(renderPing(ping));
        }

        var $pingForm = renderPingForm(id, valName, val);
        $subelements.append($pingForm);
        return $ret.append($delButton).append($subelements);
    }

    // Set the completed status of a task with the given ID.
    function setCompleted(id, completed) {
        taskTable.get(id).set('completed', completed);
    }

    // Delete the record with a given ID.
    function deleteRecord(id) {
        taskTable.get(id).deleteRecord();
    }

    // Register event listeners to handle completing and deleting.
    function addListeners() {
        $('span').click(function (e) {
            e.preventDefault();
            var li = $(this).parents('li');
            var id = li.attr('id');
            setCompleted(id, !li.hasClass('completed'));
        });

        $('button.delete').click(function (e) {
            e.preventDefault();
            var id = $(this).parents('li').attr('id');
            deleteRecord(id);
        });
    }

    // Hook form submit and add the new task.
    $('#addForm').submit(function (e) {
        e.preventDefault();
        if ($('#newTask').val().length > 0) {
            insertTask($('#newTask').val());
            $('#newTask').val('');
        }
        return false;
    });

    $('#newTask').focus();
});

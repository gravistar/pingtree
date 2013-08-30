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

            // setup the dom
            addGlobalElements();

            // setup the datastore
            addRecordsChangedListeners(datastore);
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
        var $template = ich.template(DatastoreUtil.getFieldsWithId(template));
        var i;

        // render the subtemplates and append
        var $subtemplates = $template.children('.subtemplates');
        $subtemplates.empty();
        var subtemplates = templateTable.query({parentId : id});

        for (i=0; i<subtemplates.length; i+=1)
            $subtemplates.append(renderTemplate(subtemplates[i]));

        var $targets = $template.children('.targets');
        $targets.empty();
        var targets = targetTable.query({parentId : id});

        for (i=0; i<targets.length; i+=1)
            $targets.append(renderTarget(targets[i]));

        $templateForm = renderTemplateForm();
        $targetForm = renderTargetForm();
        $templateForm.hide();
        $targetForm.hide();
        return $template.append($templateForm).append($targetForm);
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
    function renderPing(ping, valName) {
        var pingData = DatastoreUtil.getFieldsWithId(ping);
        pingData.valName = valName;
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
        var id = target.getId(), valName = target.get('valName');
        var i;

        var $target = ich.target(DatastoreUtil.getFieldsWithId(target));

        var pings = pingTable.query({parentId : id});
        var $pings = $target.children('.pings');
        $pings.empty();

        for (i=0; i<pings.length; i+=1)
            $pings.append(renderPing(pings[i], valName));

        $pingForm = renderPingForm(target.get('valName'), target.get('val'));
        $pingForm.hide();
        return $target.append($pingForm);
    }

    /**
     *
     * @param datastore
     */
    function addRecordsChangedListeners(datastore) {

        var rcTargetCb = rcCbBuilder(targetTable, templateTable, renderTarget, renderTemplate);
        var rcPingCb = rcCbBuilder(pingTable, targetTable, renderPing, renderTarget);
        var rcTemplateCb = rcCbBuilder(templateTable, templateTable, renderTemplate, renderTemplate);

        datastore.recordsChanged.addListener(rcTargetCb);
        datastore.recordsChanged.addListener(rcPingCb);
        datastore.recordsChanged.addListener(rcTemplateCb);
    }

    /**
     * Records changed callback builder. For each record that gets changed,
     * rerender its parent.  Then bind the listeners to the new parent's jquery
     * elements (stuff like listener
     * @param table
     * @param parentTable
     * @param renderFn
     * @param parentRenderFn
     * @returns {Function}
     */
    function rcCbBuilder(table, parentTable, renderFn, parentRenderFn) {
        return function (rcEvent) {

            console.log("Affected table: " + table.getId());

            var changedRecords = rcEvent.affectedRecordsForTable(table.getId()), changedRecord, $changedRecord;
            var i, changedParent, $changedParent, changedParentId;

            // render the changed records which are root. ideally would use map/filter
            var $main = $('#itemList');
            for (i=0; i<changedRecords.length; i+=1) {
                changedRecord = changedRecords[i];
                if (changedRecord.get(DatastoreUtil.defaultParentIdField) ===
                    PingTree.NO_PARENT) {
                    $changedRecord = renderFn(changedRecord);
                    $main.append($changedRecord);
                    addListeners($changedRecord);
                }
            }

            // get affected parent ids. ideally have some sort of filter
            var changedParentIds = DatastoreUtil.parentSet(changedRecords, DatastoreUtil.defaultParentIdField);

            console.log("Num affected ids: " + changedParentIds);

            for (i=0; i<changedParentIds.length; i+=1) {
                changedParentId = changedParentIds[i];
                // ideally shouldn't do this
                if (changedParentId !== PingTree.NO_PARENT) {
                    changedParent = parentTable.get(changedParentIds[i]);
                    $changedParent = parentRenderFn(changedParent);
                    $('#' + changedParent.getId()).replaceWith($changedParent);
                    addListeners($changedParent);
                }
            }
        }
    }

    /**
     * Registers all the DOM listeners on subtree of $root. Should be called whenever the datastore is changed.
     */
    function addListeners($root) {
        $root.find('button.ping_add').click(pingAddCb);
        $root.find('button.target_add').click(targetAddCb);
        $root.find('button.template_add').click(templateAddCb);
        $root.find('button.show_template_form').click(function(e) {
            e.preventDefault();
            var $parent = $(this).parent();
            $parent.children('.template_form').toggle();
        });
        $root.find('button.show_target_form').click(function(e) {
            e.preventDefault();
            var $parent = $(this).parent();
            $parent.children('.target_form').toggle();
        });
        $root.find('button.show_ping_form').click(function(e) {
            e.preventDefault();
            var $parent = $(this).parent();
            $parent.children('.ping_form').toggle();
        });
    }

    /**
     * Adds listeners on the global buttons. Should only be called once.
     */
    function addGlobalElements() {
        // add create forms
        var $globalCreateTemplate = $('#globalCreateTemplate'),
            $globalCreateTarget = $('#globalCreateTarget');

        $globalCreateTemplate.append(renderTemplateForm());
        $globalCreateTarget.append(renderTargetForm());

        // have buttons toggle the forms
        $('#globalCreateTemplateButton').click(function(e){
            e.preventDefault();
            $globalCreateTemplate.children('.template_form').toggle();
        });

        $('#globalCreateTargetButton').click(function(e){
            e.preventDefault();
            $globalCreateTarget.children('.target_form').toggle();
        });

        // have the forms use the global callbacks
        $globalCreateTemplate.find('button.template_add').click(globalTemplateAddCb);
        $globalCreateTarget.find('button.target_add').click(globalTargetAddCb);
    }

    /**
     * Callback for the ping_add button. Creates a new ping.
     * @param e
     */
    function pingAddCb(e) {
        e.preventDefault();
        var $target = $(this).closest('.target');
        var $parent = $(this).parent();
        var parentId = $target.attr('id'), val = $parent.find("input").val(), createTime = new Date();
        pingTable.insert(PingTree.buildPing(parentId, val , createTime));
    }

    /**
     * Callback for the target_add button. Creates a new target.
     * @param e
     */
    function targetAddCb(e) {
        e.preventDefault();
        var $template = $(this).closest('.template');
        var $parent = $(this).parent();
        var parentId = $template.attr('id');
        createTargetRecordFromForm($parent, parentId);
    }

    /**
     * For creating targets without parents.  Only way to do this is with the target create button.
     * @param e
     */
    function globalTargetAddCb(e) {
        e.preventDefault();
        var $parent = $(this).parent();
        createTargetRecordFromForm($parent, PingTree.NO_PARENT);
    }

    function createTargetRecordFromForm($parent, parentId) {
        var name = $parent.find("input[name='name']").val(),
            val = $parent.find("input[name='val']").val(),
            valName = $parent.find("input[name='valName']").val(),
            valUpperBound = $parent.find("input[name='valUpperBound']").val(),
            targetCount = $parent.find("input[name='targetCount']").val(),
            countUpperBound = $parent.find("input[name='countUpperBound']").val(),
            createTime = new Date();
        targetTable.insert(PingTree.buildTarget(name, parentId, val, valUpperBound, valName, targetCount, countUpperBound, createTime));
    }

    /**
     * Callback for the template_add button. Creates a new template.
     * @param e
     */
    function templateAddCb(e) {
        e.preventDefault();
        var $template = $(this).closest('.template');
        var $parent = $(this).parent();
        var parentId = $template.attr('id');
        createTemplateRecordFromForm($parent, parentId);
    }

    function createTemplateRecordFromForm($parent, parentId) {
        var name = $parent.find("input[name='name']").val();
        templateTable.insert(PingTree.buildTemplate(name, parentId));
    }

    function globalTemplateAddCb(e) {
        e.preventDefault();
        var $parent = $(this).parent();
        createTemplateRecordFromForm($parent, PingTree.NO_PARENT);
    }
});

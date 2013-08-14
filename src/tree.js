/**
 * Created with JetBrains WebStorm.
 * User: david
 * Date: 8/6/13
 * Time: 11:17 PM
 * To change this template use File | Settings | File Templates.
 */
$(function () {
    var tasks = []
    // Insert a new task record into the table.
    function insertTask(text) {
        taskTable.insert({
            taskname: text,
            created: new Date(),
            completed: false,
            children: []
        });
    }

    // updateList will be called every time the table changes.
    function updateList() {
        $('#tasks').empty();

        // Add an item to the list for each task.
        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            $('#tasks').append(
                renderTask(record.getId(),
                    record.get('completed'),
                    record.get('taskname')),
                i);
        }

        addListeners();
        $('#newTask').focus();
    }

    $('#main').show();

    // Populate the initial task list.
    updateList();

    // Set the completed status of a task with the given ID.
    function setCompleted(id, completed) {
        taskTable.get(id).set('completed', completed);
    }

    // Delete the record with a given ID.
    function deleteRecord(id) {
        taskTable.get(id).deleteRecord();
    }

    // Render the HTML for a single task.
    function renderTask(id, completed, text, indent) {
        return $('<li>').attr('id', id)
            //.attr('margin-left', '10px')
            .append(
                $('<button>').addClass('delete').html('&times;')
            ).append(
                $('<span>').append(
                        $('<button>').addClass('checkbox').html('&#x2713;')
                    ).append(
                        $('<span>').addClass('text').text(text)
                    )
            )
            .addClass(completed ? 'completed' : '');
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
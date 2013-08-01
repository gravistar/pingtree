// Insert your Dropbox app key here:
var DROPBOX_APP_KEY = 'xoit9j3uwj9vmdv';

// Exposed for easy access in the browser console.
var client = new Dropbox.Client({key: DROPBOX_APP_KEY});
var taskTable;
/**
 *  Task prototype:
 *
 *  Task: {
 *
 *      (fields that have to do with the task and its metadata)
 *      task_fields: {
 *          desc: just a string description of task (cannot not be "")
 *          creation_time: time when task was created (always valid date)
 *          completion_times: sorted array of times when the task was marked completed (undefined if not finished)
 *      }
 *
 *      (fields that have to do with the task's placement in the forest)
 *      tree_fields: {
 *          children: an array (or dict) of immediate subtasks (undefined if leaf)
 *          parent: parent task of this task (undefined if root)
 *          depth: depth of this task in the task tree (not undefined. root has 0)
 *      }
 *
 *      (metadata about symlinks. i'll always do compression with links. therefore, it should never be the
 *       case that forward_link & backward_links === true)
 *      symlink: {
 *          forward_link: datastore id of the task this symlinks to (undefined if not a symlink)
 *          backward_links: an array of datastore ids of tasks that link to this one ([] if task is not linked to)
 *      }
 *  }
 *
 *
 *  Need task builder method
 *  Need
 *  Need symlink handling methods
 *      making a symlink
 *      updating
 *      validation
 */
/*
Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        return this;
    }
}
  */
// just going to use composition


// wrap in module?
var ListTree = {
    /**
     * Constructor for a task. Should be the only way to make a task
     * @param text
     * @returns {{task_fields: {task: *, creation_time: Date, completion_times: Array},
     *           tree_fields: {children: Array, parent: *, depth: number}}}
     */
    createTask: function(desc) {
        return {
            task_fields: {
                desc: desc,
                creation_time: new Date(),
                completion_times: []
            },
            tree_fields: {
                children: [],
                parent:   undefined,
                depth:    0
            }
        };
    },

    /**
     * Adds child to parent. Side effects. Modifies both child and parent
     * @param child
     * @param parent
     */
    appendTask: function(child, parent) {
        parent.tree_fields.children = parent.tree_fields.children.concat(child);
        child.tree_fields.parent = parent;
        child.tree_fields.depth = parent.tree_fields.depth + 1;
    },

    /**
     * Remove child from parent. Side effects. Modifies both child and parent
     * @param child
     * @param parent
     */
    removeTask: function(child, parent) {
        parent.tree_fields.children = parent.tree_fields.children.filter(
            function(x) { return x !== child }
        );
        child.tree_fields.parent = undefined
        child.tree_fields.depth = 0
    }
};

$(function () {
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
					record.get('taskname')),
                    i);
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

		client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
			if (error) {
				alert('Error opening default datastore: ' + error);
			}

			taskTable = datastore.getTable('tasks');

			// Populate the initial task list.
			updateList();

			// Ensure that future changes update the list.
			datastore.recordsChanged.addListener(updateList);
		});
	}

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

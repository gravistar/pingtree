/**
 * Created with JetBrains WebStorm.
 * User: david
 * Date: 8/6/13
 * Time: 11:15 PM
 * To change this template use File | Settings | File Templates.
 */

// wrap in module?
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
var TaskTree = {
    /**
     * Constructor for a task. Should be the only way to make a task
     * @param text
     * @returns {{task_fields: {task: *, creation_time: Date, completion_times: Array},
     *           tree_fields: {children: Array, parent: *, depth: number}}}
     */
    createTask: function(desc) {
        return {
            id: undefined, // provided by datastore. for now, just using rand
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
    },

    /**
     * Renders the html of a task
     * @param task
     */
    renderTask: function(task) {
        var id = task.id, desc = task.desc, completed = task.completion_times.length > 0
        return $('<li>').attr('id', id).append(
                $('<button>').addClass('delete').html('&times;')
            ).append(
                $('<span>').append(
                        $('<button>').addClass('checkbox').html('&#x2713;')
                    ).append(
                        $('<span>').addClass('text').text(desc)
                    )
            ).append($('<button>').addClass('add_child').html('o'))
            .addClass(completed ? 'completed' : '');
    }
};

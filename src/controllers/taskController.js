const Task = require('../models/task');
const User = require('../models/user')

class TaskController {
    async createNewTask(req, res) {
        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status || 'open', // Default to 'open'
            assignee: req.body.assignee
        });

        console.log(task)

        try {
            await task.save();
            res.status(201).send(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllTasks(req, res) {
        try {
            const tasks = await Task.find();
            res.status(200).send(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        }
    }

    async getTaskById(req, res) {
        const taskId = req.params.id;

        try {
            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).send();
            }
            res.status(200).send(task);
        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        }
    }

    async quickUpdateTask(req, res) {
        const taskId = req.params.id;

        try {
            // Check if the assignee exists in the User collection
            const assigneeExists = await User.exists({ name: req.body.assignee });

            if (!assigneeExists) {
                return res.status(400).json({ error: 'Assignee does not exist' });
            }

            // Update the task
            const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });

            if (!updatedTask) {
                return res.status(404).send();
            }

            res.status(200).send(updatedTask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateTaskWithAssignee(req, res) {
        const taskId = req.params.id;
        const { assignee, ...updateFields } = req.body;

        try {
            // Check if the assignee exists in the User collection
            const assigneeExists = await User.exists({ _id: assignee });

            if (!assigneeExists) {
                return res.status(400).json({ error: 'Assignee does not exist' });
            }

            // Update the task with the specified assignee and other fields
            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                { assignee, ...updateFields },
                { new: true }
            );

            if (!updatedTask) {
                return res.status(404).send();
            }

            res.status(200).send(updatedTask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new TaskController();

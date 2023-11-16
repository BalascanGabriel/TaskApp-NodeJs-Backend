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
            // Check if the task exists
            const taskExists = await Task.exists({ _id: taskId });

            if (!taskExists) {
                return res.status(404).json({ error: 'Task not found' });
            }

            // Extract the assignee from the request body (if provided)
            const { assignee, ...updateFields } = req.body;

            // Update the task fields without modifying the assignee
            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                { $set: updateFields },
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

    async asignTaskToUser(req, res) {
        //get the task id and user id which the task will be given
        const taskId = req.params.taskId;
        const userId = req.body.userId;

        try {
            //check if the user exists
            const asigneeExists = await User.exists({ _id: userId })
            //if it does not
            if (!asigneeExists) {
                res.status(404).json({ error: "Asignee does not exist" });
            }
            //if does exist
            //find task by taskId and then update asignee with userId from req body
            //By default findByIdAndUpdate returns the document before update, if new:true is set, it return the updated one
            const updatedTask = await Task.findByIdAndUpdate(taskId,
                { assignee: userId },
                { new: true }
            )
            //If smth happend with the update
            if (!updatedTask) {
                res.status(404).json({ error: 'Document update problem' })
            }
            //everything okay
            res.status(200).send(updatedTask)

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserTasks(req, res) {
        const userId = req.params.userId;

        try {
            //Check if user does indeed exist
            const userExists = await User.exists({ _id: userId })
            if (!userExists) {
                res.status(404).json({ error: "User does not exist !" })
            }

            //find all records where asignee equals userId from params
            const userTasks = await Task.find({ assignee: userId })

            if (userTasks === 0) {
                res.status(404).json({ error: "No tasks found for required user..." })
            }

            res.status(200).send(userTasks)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async setTaskStatus(req, res) {
        const taskId = req.params.taskId;
        const newStatus = req.body.newStatus;

        try {
            //get task
            const task = await Task.findById(taskId)
            //if task does not exist
            if (!task) {
                res.status(404).json({ error: 'Task not found' })
            }
            //check if new status is valid
            if (!['open', 'in-progress', 'closed'].includes(newStatus)) {
                return res.status(400).json({ error: 'Invalid status!' })
            }
            // Check the current status
            const currentStatus = task.status;

            // Update the task status if the new status is different
            if (currentStatus !== newStatus) {
                task.status = newStatus;
                await task.save();
            }

            res.status(200).json({ currentStatus: task.status });
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    }

}
module.exports = new TaskController();

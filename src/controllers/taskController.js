const Task = require('../models/task');
const User = require('../models/user')
const authMiddleware = require('../middleware/authMiddleware');


class TaskController {
    async createNewTask(req, res) {
        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status || 'open',
            assignee: req.userId, // Assign the task to the authenticated user
        });

        try {
            await task.save();
            res.status(201).send(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllTasks(req, res) {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        try {
            const tasks = await Task.find({ assignee: req.userId })
                .skip(skip)
                .limit(pageSize);

            const totalTasks = await Task.countDocuments({ assignee: req.userId });

            const totalPages = Math.ceil(totalTasks / pageSize);

            res.status(200).json({
                tasks,
                currentPage: page,
                totalPages,
            });
        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        }
    }

    async getAllTasksOrdered(req, res) {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder && req.query.sortOrder.toLowerCase() === 'desc' ? -1 : 1;

        try {
            const tasks = await Task.find({ assignee: req.userId })
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(pageSize);

            const totalTasks = await Task.countDocuments({ assignee: req.userId });

            const totalPages = Math.ceil(totalTasks / pageSize);

            res.status(200).json({
                tasks,
                currentPage: page,
                totalPages,
            });
        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        }
    }


    async getTaskById(req, res) {
        const taskId = req.params.id;

        try {
            const task = await Task.findOne({ _id: taskId, assignee: req.userId }); // Check ownership
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

    async deleteTask(req, res) {
        const taskId = req.params.taskId;

        try {
            const taskExists = await Task.exists({ _id: taskId })
            if (!taskExists) {
                return res.status(404).json({ error: "Task not found" });
            }
            const deletedTask = await Task.deleteOne({ _id: taskId })
            if (!deletedTask) {
                return res.status(404).send()
            }
            res.status(200).send(deletedTask);
        } catch (error) {
            res.status(500).json({ error: error.message })
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
        const taskId = req.params.taskId;
        const userId = req.body.userId;

        try {
            // check if the user exists
            const asigneeExists = await User.exists({ _id: userId });

            // log the values for debugging
            console.log('UserId:', userId);
            console.log('AsigneeExists:', asigneeExists);

            if (asigneeExists === null) {
                return res.status(404).json({ error: "Error checking if asignee exists" });
            }

            if (!asigneeExists) {
                return res.status(404).json({ error: "Asignee does not exist" });
            }

            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                { assignee: userId },
                { new: true }
            );

            if (!updatedTask) {
                return res.status(404).json({ error: 'Document update problem' });
            }

            return res.status(200).send(updatedTask);
        } catch (error) {
            console.error('Error in asignTaskToUser:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    async getUserTasks(req, res) {
        const userId = req.params.userId;
        // TO-DO: Implement pagination
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        try {
            // Check if the user indeed exists
            const userExists = await User.exists({ _id: userId });
            if (!userExists) {
                return res.status(404).json({ error: "User does not exist!" });
            }

            // Find all records where assignee equals userId from params
            const userTasks = await Task.find({ assignee: userId })
                .skip(skip)
                .limit(pageSize);

            if (userTasks.length === 0) {
                return res.status(404).json({ error: "No tasks found for the required user..." });
            }

            // Count total number of tasks for the user
            const totalTasks = await Task.countDocuments({ assignee: userId });

            // Calculate total number of pages
            const totalPages = Math.ceil(totalTasks / pageSize);

            res.status(200).json({
                tasks: userTasks,
                currentPage: page,
                totalPages: totalPages,
                pageSize: pageSize,
                totalTasks: totalTasks,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserTasksOrdered(req, res) {
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;
    
        try {
            const userExists = await User.exists({ _id: userId });
            if (!userExists) {
                return res.status(404).json({ error: "User does not exist!" });
            }
    
            const userTasks = await Task.find({ assignee: userId })
                .sort({ createdAt: -1 }) // Order by createdAt in descending order
                .skip(skip)
                .limit(pageSize);
    
            if (userTasks.length === 0) {
                return res.status(404).json({ error: "No tasks found for the required user..." });
            }
    
            const totalTasks = await Task.countDocuments({ assignee: userId });
    
            const totalPages = Math.ceil(totalTasks / pageSize);
    
            res.status(200).json({
                tasks: userTasks,
                currentPage: page,
                totalPages: totalPages,
                pageSize: pageSize,
                totalTasks: totalTasks,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
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
    
    async filterTasksByStatus(req, res) {
        const status = req.query.status;

        // TO-DO: Implement pagination
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        try {
            if (!['open', 'in-progress', 'closed'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status!' });
            }

            const filteredTasks = await Task.find({
                status,
                assignee: req.userId, // Filter tasks only for the authenticated user
            })
                .skip(skip)
                .limit(pageSize);

            if (filteredTasks.length === 0) {
                return res.status(404).json({ error: "No tasks found for the required status." });
            }

            // Count total number of tasks with the specified status for the user
            const totalTasks = await Task.countDocuments({
                status,
                assignee: req.userId,
            });

            // Calculate total number of pages
            const totalPages = Math.ceil(totalTasks / pageSize);

            res.status(200).json({
                tasks: filteredTasks,
                currentPage: page,
                totalPages: totalPages,
                pageSize: pageSize,
                totalTasks: totalTasks,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async countFilterTasksByStatus(req, res) {

    }

}
module.exports = new TaskController();

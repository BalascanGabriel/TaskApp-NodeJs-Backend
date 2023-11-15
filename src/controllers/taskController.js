const Task = require('../models/task')

class TaskController {
    async createNewTask(req, res) {
        const task = new Task(req.body)

        try {
            await task.save()
            res.status(201).send(task)
        } catch (error) {
            res.status(500).json({ error: error })
        }
    }

    async getAllTasks(req, res) {
        try {
            const tasks = await Task.find()
            res.status(200).send(tasks)
        } catch (error) {
            res.status(500).json({ error: error })
        }
    }

    async getTaskById(req, res) {
        const taskId = req.params.id

        try {
            const task = await Task.findById(taskId)
            res.status(201).send(task)
        } catch (error) {
            res.status(500).json({ error: error })
        }
    }
}

module.exports = new TaskController()
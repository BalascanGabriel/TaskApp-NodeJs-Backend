const express = require('express')
const router = express.Router()

const taskController = require('../controllers/taskController')

//CREATE NEW TASK   
router.post('/new-task', taskController.createNewTask)

//GET ALL TASKS
router.get('/get-all-tasks', taskController.getAllTasks)

//GET TASK BY ID    
router.get('/get-task/:id', taskController.getTaskById)

//QUICK UPDATE TASK
router.patch('/quick-update-task/:id', taskController.quickUpdateTask)

// UPDATE TASK WITH ASSIGNEE
router.patch('/update-task-with-assignee/:id', taskController.updateTaskWithAssignee);

module.exports = router
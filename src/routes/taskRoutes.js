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

//DELETE TASK
router.delete('/delete-task/:taskId', taskController.deleteTask)

// UPDATE TASK WITH ASSIGNEE
router.patch('/update-task-with-assignee/:id', taskController.updateTaskWithAssignee);

//ASSIGN TASK TO USER
router.patch('/assign-task/:taskId', taskController.asignTaskToUser)

//GET ALL TASKS FOR A USER
router.get('/get-user-tasks/:userId', taskController.getUserTasks)

//SET TASK STATUS
router.patch('/set-task-status/:taskId', taskController.setTaskStatus)

//GET TASKS BY STATUS
router.get('/filter-tasks', taskController.filterTasksByStatus)

module.exports = router
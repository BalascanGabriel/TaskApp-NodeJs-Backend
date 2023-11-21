const express = require('express')
const router = express.Router()

const taskController = require('../controllers/taskController')
const authMiddleware = require('../middleware/authMiddleware');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');


//NEEDS BASIC AUTH
router.use(authMiddleware);
//CREATE NEW TASK   
router.post('/new-task', taskController.createNewTask)

//GET ALL TASKS
router.get('/get-all-tasks', taskController.getAllTasks)

//GET TASK BY ID    
router.get('/get-task/:id', taskController.getTaskById)


//GET TASKS BY STATUS
router.get('/filter-tasks', taskController.filterTasksByStatus)


//NEEDS ADMINISTATOR AUTH
//router.use(adminAuthMiddleware);
//DELETE TASK
router.delete('/delete-task/:taskId', taskController.deleteTask)

//QUICK UPDATE TASK
router.patch('/quick-update-task/:id', adminAuthMiddleware, taskController.quickUpdateTask)

// UPDATE TASK WITH ASSIGNEE
router.patch('/update-task-with-assignee/:id', adminAuthMiddleware, taskController.updateTaskWithAssignee);

//ASSIGN TASK TO USER
router.patch('/assign-task/:taskId', adminAuthMiddleware, taskController.asignTaskToUser)

//GET ALL TASKS FOR A USER
router.get('/get-user-tasks/:userId', adminAuthMiddleware, taskController.getUserTasks)

//SET TASK STATUS
router.patch('/set-task-status/:taskId', adminAuthMiddleware, taskController.setTaskStatus)



module.exports = router
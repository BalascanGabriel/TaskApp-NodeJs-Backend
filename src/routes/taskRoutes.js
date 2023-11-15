const express = require('express')
const router = express.Router()

const taskController = require('../controllers/taskController')

//CREATE NEW TASK   
router.post('/tasks', taskController.createNewTask)

//GET ALL TASKS
router.get('/tasks', taskController.getAllTasks)

//GET TASK BY ID    
router.get('/tasks/:id', taskController.getTaskById)

module.exports = router
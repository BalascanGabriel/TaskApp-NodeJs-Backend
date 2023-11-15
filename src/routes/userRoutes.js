const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


//CREATE NEW USER
router.post('/users', userController.createUser)

//GET ALL USERS
router.get('/users', userController.getAllUsers)

//GET USER BY ID    
router.get('/user/:id', userController.getUserById)




module.exports = router
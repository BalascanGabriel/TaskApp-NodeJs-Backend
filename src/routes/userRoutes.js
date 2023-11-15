const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


//CREATE NEW USER
router.post('/new-user', userController.createUser)

//GET ALL USERS
router.get('/get-all-users', userController.getAllUsers)

//GET USER BY ID    
router.get('/get-user/:id', userController.getUserById)

//UPDATE USER
router.patch('/update-user/:id', userController.updateUser)

//DELETE USER
router.delete('/delete-user/:id', userController.deleteUserById)


module.exports = router
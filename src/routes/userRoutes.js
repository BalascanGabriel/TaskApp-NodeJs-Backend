const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const multer = require('multer');



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

//CHANGE-PASSWORD
router.patch('/change-password', userController.changePassword)

//SET USER ROLE
router.patch('/set-user-role/:id', userController.setUserRole);

//UPLOAD AVATAR
router.post('/upload-avatar-for-user/:id/avatar', multer().single('avatar'), userController.uploadAvatar);



module.exports = router
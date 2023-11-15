require("dotenv").config();
const express = require("express");
const app = express();

const User = require('./src/models/user')
const Task = require('./src/models/task')

//By requiering this, the code in that file is executed and connection ran
require('./src/db/dbConnection')

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Salut vere</h1>');
});

//Dupa async acum se intorc Promises
//CREATE NEW USER
app.post('/users', async (req, res) => {
    // const user = new User(req.body)
    // user.save().then(() => {
    //     console.log(`User with id: ${user._id} created`)
    //     res.send(user)
    // }).catch((error) => {
    //     return res.status(400).json({ error: error })
    // })
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
})

//GET ALL USERSS
app.get('/users', async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).send(users)

    } catch (error) {
        res.status(500).json({ error: 'Server Error' })
    }
});

//GET USER BY ID
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).send()
        }
        res.status(201).send(user)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//CREATE NEW TASK
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//GET ALL TASKS
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//GET TASK BY ID
app.get('/tasks/:id', async (req, res) => {
    const taskId = req.params.id

    try{
        const task = await Task.findById(taskId)
        res.status(201).send(task)
    }catch(error){
        res.status(500).json({error : error})
    }
})

app.listen(3000, () => console.log("Server started ! "));
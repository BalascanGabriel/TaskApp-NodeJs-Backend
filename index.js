require("dotenv").config();
const express = require("express");
const app = express();

//importing user routes
const userRoutes = require('./src/routes/userRoutes')
//importing task routes
const taskRoutes = require('./src/routes/taskRoutes')

//By requiering this, the code in that file is executed and connection ran
require('./src/db/dbConnection')

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Salut vere</h1>');
});

app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)

app.listen(3000, () => console.log("Server started ! "));
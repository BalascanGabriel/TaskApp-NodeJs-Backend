const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    }

})

module.exports = Task
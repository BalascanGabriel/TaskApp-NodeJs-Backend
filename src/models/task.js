// models/task.js
const mongoose = require('mongoose');
const defaultUserId = new mongoose.Types.ObjectId('5f82a0b9e6b1759a4e6bf545');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed'], // Define possible statuses
    default: 'open',
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    default: defaultUserId, // Set a default value, you can change this to any default you prefer

  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

const mongoose = require('mongoose');




const taskSchema = new mongoose.Schema({
title: String,
completed: Boolean,
createdAt: { type: Date, default: Date.now },
reminderTime: { type: Date, default: () => new Date(Date.now() + 1 * 60 * 60 * 1000) } // default 1 hour later
});




const Task = mongoose.model('Task', taskSchema);




module.exports = Task;
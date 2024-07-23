const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
const port = 5001;


app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/tasks', { useNewUrlParser: true, useUnifiedTopology: true });


const taskSchema = new mongoose.Schema({
 title: String,
 completed: Boolean,
 reminderTime: Date,
});


const Task = mongoose.model('Task', taskSchema);


// fetch all tasks ;)
app.get('/tasks', async (req, res) => {
 try {
   const tasks = await Task.find();
   res.json(tasks);
 } catch (err) {
   console.error('Error fetching tasks:', err);
   res.status(500).json({ message: err.message });
 }
});


// add a new task
app.post('/tasks', async (req, res) => {
 const task = new Task({
   title: req.body.title,
   completed: req.body.completed || false,
   reminderTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later?
 });


 try {
   const newTask = await task.save();
   res.status(201).json(newTask);
 } catch (err) {
   console.error('Error adding task:', err);
   res.status(400).json({ message: err.message });
 }
});


// toggle task completion
app.put('/tasks/:id', async (req, res) => {
 try {
   const task = await Task.findById(req.params.id);
   if (task) {
     task.completed = !task.completed;
     const updatedTask = await task.save();
     res.json(updatedTask);
   } else {
     res.status(404).json({ message: 'Task not found' });
   }
 } catch (err) {
   console.error('Error updating task:', err);
   res.status(500).json({ message: err.message });
 }
});


// delete a task
app.delete('/tasks/:id', async (req, res) => {
 try {
   const task = await Task.findByIdAndDelete(req.params.id);
   if (task) {
     res.json({ message: 'Task deleted', task });
   } else {
     res.status(404).json({ message: 'Task not found' });
   }
 } catch (err) {
   console.error('Error deleting task:', err); // gpt: Improved error logging
   res.status(500).json({ message: err.message });
 }
});


app.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}`);
});

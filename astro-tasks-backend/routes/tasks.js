const express = require('express');
const router = express.Router();
const Task = require('../models/task');


// createe a new task
router.post('/', async (req, res) => {
 try {
   const task = new Task(req.body);
   await task.save();
   res.send(task);
 } catch (error) {
   res.status(500).json({ message: 'Error creating task', error });
 }
});


// get all tasks
router.get('/', async (req, res) => {
 try {
   const tasks = await Task.find();
   res.send(tasks);
 } catch (error) {
   res.status(500).json({ message: 'Error fetching tasks', error });
 }
});


// update a task
router.put('/:id', async (req, res) => {
 try {
   const task = await Task.findById(req.params.id);
   if (!task) {
     return res.status(404).json({ message: 'Task not found' });
   }
   task.completed = req.body.completed;
   await task.save();
   res.send(task);
 } catch (error) {
   res.status(500).json({ message: 'Error updating task', error });
 }
});


// deleete a task
router.delete('/:id', async (req, res) => {
 try {
   const task = await Task.findByIdAndDelete(req.params.id);
   if (!task) {
     return res.status(404).json({ message: 'Task not found' });
   }
   res.send({ message: 'Task deleted', task });
 } catch (error) {
   res.status(500).json({ message: 'Error deleting task', error });
 }
});


// update  completed status of a task
router.patch('/:id/complete', async (req, res) => {
 try {
   const task = await Task.findByIdAndUpdate(req.params.id, { completed: req.body.completed }, { new: true });
   if (!task) {
     return res.status(404).json({ message: 'Task not found' });
   }
   res.send(task);
 } catch (error) {
   res.status(500).json({ message: 'Error updating task status', error });
 }
});


module.exports = router;
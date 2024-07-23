// src/components/Tasks.js
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import './Tasks.css';
import VoiceDictation from './VoiceDictation';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await axios.post('/tasks', { title: newTask, completed: false });
        setTasks([...tasks, response.data]);
        setNewTask('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const task = tasks.find(task => task._id === taskId);
      if (!task) {
        console.error('Task not found with ID:', taskId);
        return;
      }

      const response = await axios.patch(`/tasks/${taskId}/complete`, { completed: !task.completed });
      setTasks(tasks.map(task => task._id === taskId ? response.data : task));
    } catch (error) {
      if (error.response) {
        console.error('Error toggling task (server response):', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Error toggling task (no response):', error.request);
      } else {
        console.error('Error toggling task:', error.message);
      }
    }
  };

  const handleTranscript = (transcript) => {
    setNewTask(transcript);
    addTask(transcript);
  };

  return (
    <div className="tasks-container">
      <h1>Astro Tasks</h1>
      <VoiceDictation onTranscript={handleTranscript} />
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map(task => (
          <li
            key={task._id}
            className={task.completed ? 'completed' : ''}
            onClick={() => toggleTaskCompletion(task._id)}
          >
            {task.title}
            <button onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
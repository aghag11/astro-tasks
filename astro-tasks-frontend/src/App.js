import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import VoiceDictation from './components/VoiceDictation';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));

    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const addTask = (task) => {
    if (task.trim()) {
      axios.post('http://localhost:5001/tasks', { title: task, completed: false })
        .then(response => setTasks([...tasks, response.data]))
        .catch(error => console.error('Error adding task:', error));
      setNewTask('');
    }
  };

  const handleTranscript = (transcript) => {
    setNewTask(transcript);
    addTask(transcript);
  };

  const toggleTaskCompletion = (id) => {
    const task = tasks.find(task => task._id === id);
    axios.put(`http://localhost:5001/tasks/${id}`, { completed: !task.completed })
      .then(response => setTasks(tasks.map(task => task._id === id ? response.data : task)))
      .catch(error => console.error('Error toggling task:', error));
  };

  const triggerNotification = (title) => {
    if (Notification.permission === 'granted') {
      new Notification('Task Reminder', {
        body: `Reminder for task: ${title}`,
        icon: '/path/to/icon.png'
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        if (new Date(task.reminderTime) <= now && !task.completed) {
          triggerNotification(task.title);
        }
      });
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="app">
      <header>
        <h1>Astro Tasks</h1>
      </header>
      <div className="task-container">
        <div className="input-container">
          <input
            type="text"
            placeholder="New Task"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
          />
          <button onClick={() => addTask(newTask)}>Add Task</button>
          <VoiceDictation onTranscript={handleTranscript} />
        </div>
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task._id} className={task.completed ? 'completed' : ''}>
              <span onClick={() => toggleTaskCompletion(task._id)}>{task.title}</span>
              <button onClick={() => axios.delete(`http://localhost:5001/tasks/${task._id}`)
                .then(() => setTasks(tasks.filter(t => t._id !== task._id)))
                .catch(error => console.error('Error deleting task:', error))}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
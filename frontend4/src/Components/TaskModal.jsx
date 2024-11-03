import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const TaskModal = ({ isOpen, onClose }) => {
  const initialTasks = Array.from({ length: 20 }, (_, index) => ({
    title: `Task ${index + 1}`,
    description: '',
    progress: 50,
    assignee: '',
  }));

  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState('');
  const [date , setDate] = useState('');
  const [location, setLocation] = useState('');
  const [hour, setHour] = useState(Number);
  const [id, setId] = useState(Number);
  const [loggedUser, setLoggedUser] = useState('');

 useEffect(() => {
        (async () => {
            const username2 = process.env.REACT_APP_USERNAME; 
          const password2 = process.env.REACT_APP_PASSWORD; 
          const credentials = btoa(`${username2}:${password2}`);
            const response = await fetch("http://localhost:8080/user/getToken", {
            method : "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Basic ${credentials}`
            },
            credentials: 'include'
          });
            const data = await response.json();
            console.log(data.jwtToken);
            if(data.jwtToken != null){
            const decoded = jwtDecode(data.jwtToken);
            setLoggedUser(decoded.sub);
            } else {
                console.log("No token");
            }
        })();
    }, []);

  const handleChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };
  if (!isOpen) return null;

  const buildInvolvedUsers = (tasks) => {
    let users = [];
    tasks.forEach(task => {
      if (task.assignee !== '') {
        users.push(task.assignee);
      }
    });
    return users;
  };

  const buildTaskList = (tasks) => {
  let taskList = [];
  
  tasks.forEach(task => {
    if (task.description !== '') {
      taskList.push([
        String(task.title),
        String(task.description),
        String(task.progress),
        String(task.assignee)
      ]);
    }
  });
  
  return taskList;
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
       
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md h-auto max-h-[80vh] overflow-auto relative">
        <button 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none" 
          onClick={onClose}
        >
          &times; 
        </button>
        <h2 className="text-xl font-semibold mb-4">Event title</h2>
          <div className="space-y-4">
            <input
                  type="text"
                  placeholder='Event title'
                  onChange={(e) => setTitle(e.target.value)}
                  className="border rounded w-full p-2"
                />
          </div>
        <h2 className="text-xl font-semibold mb-4">Event date</h2>
        <div className="space-y-4">
            <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  onChange={(e) => setDate(e.target.value)}
                  className="border rounded w-full p-2"
                />
          </div>
        <h2 className="text-xl font-semibold mb-4">Event hour</h2>
        <div className="space-y-4">
          <label className="block mb-1">
                <input
                  type="number"
                  onChange={(e) => setHour(e.target.value)}
                  className="border rounded w-full p-2"
                  min={0}
                  max={24}
                />
              </label>
        </div>
          <h2 className="text-xl font-semibold mb-4">Event location</h2>
          <div className="space-y-4">
            <input
                  type="text"
                  placeholder="Location"
                  onChange={(e) => setLocation(e.target.value)}
                  className="border rounded w-full p-2"
                />
          </div>
        <h2 className="text-xl font-semibold mb-4">Task List</h2>
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-1">
                Title:
                <input
                  type="text"
                  placeholder={`Task ${index + 1}`}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  className="border rounded w-full p-2"
                />
              </label>
              <label className="block mb-1">
                Description:
                <input
                  type="text"
                  value={task.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  className="border rounded w-full p-2"
                />
              </label>
              <label className="block mb-1">
                Progress:
                <input
                  type="number"
                  value={task.progress}
                  onChange={(e) => handleChange(index, 'progress', e.target.value)}
                  className="border rounded w-full p-2"
                />
              </label>
              <label className="block mb-1">
                Assignee:
                <input
                  type="text"
                  value={task.assignee}
                  onChange={(e) => handleChange(index, 'assignee', e.target.value)}
                  className="border rounded w-full p-2"
                />
              </label>
            </div>
          ))}
        </div>
        <button className='bg-black text-white px-4 py-2 rounded-lg' onClick={() => {
          const username2 = process.env.REACT_APP_USERNAME; 
          const password2 = process.env.REACT_APP_PASSWORD; 
          const credentials = btoa(`${username2}:${password2}`);
          (async () => {
              try {
                const response = await fetch("http://localhost:8080/events/getCount", {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${credentials}`
                  },
                  credentials: 'include'
                });
                const data = await response.json();
                setId(data);
                console.log(buildTaskList(tasks));
              } catch (error) {
                console.error(error);
              }
            })();
            (async () => {
              try {
                const response = await fetch("http://localhost:8080/events/createEvent", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${credentials}`
                  },
                  credentials: 'include',
                  body: JSON.stringify({
                    id : id,
                    title : title,
                    involvedUsers : buildInvolvedUsers(tasks),
                    tasks : buildTaskList(tasks),
                    admin : loggedUser,
                    location : location,
                    date : date,
                    time : hour.toString()
                  })
                });
                const data = await response.json();
                console.log(data);
              } catch (error) {
                console.error(error);
              }
            })();
            onClose()}}> Create room </button>
      </div>
    </div>
  )
};

export default TaskModal;

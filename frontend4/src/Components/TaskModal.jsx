import React, { useState } from 'react';

const TaskModal = ({ isOpen, onClose }) => {
  const initialTasks = Array.from({ length: 20 }, (_, index) => ({
    title: `Task ${index + 1}`,
    description: '',
    progress: 50,
    assignee: '',
  }));

  const [tasks, setTasks] = useState(initialTasks);

  const handleChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
       
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md h-auto max-h-[80vh] overflow-auto relative">
        <button 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none" 
          onClick={onClose}
        >
          &times; 
        </button>
        <h2 className="text-xl font-semibold mb-4">Task List</h2>
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-1">
                Title:
                <input
                  type="text"
                  value={task.title}
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
            console.log(tasks);
            onClose()}}> Create room </button>
      </div>
    </div>
  )
};

export default TaskModal;

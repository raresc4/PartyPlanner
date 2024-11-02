import React from 'react';
import { useEffect,useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import TaskModal from '../Components/TaskModal';
import BaseLayout from '../Layouts/BaseLayout';

const ProfilePage = () => {
    const [tokenExists, setTokenExists] = useState(false);
    const [loggedUser, setLoggedUser] = useState('');

useEffect( () => {
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
            console.log(decoded.sub);
            setTokenExists(true);
            setLoggedUser(decoded.sub);
            } else {
                console.log("No token");
            }
        })();
    }, []);
    const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false); // Ensure this is defined
    const [isModalOpen, setModalOpen] = useState(false);
  return tokenExists ? (
    <BaseLayout>
    <div className="flex flex-1 items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg border border-gray-200 max-w-md w-full">
        {/* Left Side - Profile Info */}
        <div className="flex flex-col items-center text-center mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">{loggedUser}'s Profile</h2>
          <div className="space-y-3">
            <p className="text-gray-600"><strong>Last Login:</strong> Oct 25, 2024</p>
            <p className="text-gray-600"><strong>Account Created:</strong> Jan 12, 2023</p>
            <div>
              <strong className="text-gray-700">Parties:</strong>
              <ul className="list-disc ml-6 mt-2 text-gray-600">
                <li>Party 1</li>
                <li>Party 2</li>
                <li>Party 3</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - Search and Actions */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search parties..."
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="bg-black text-white px-4 py-2 rounded-lg transition duration-200">Search</button>
          </div>
          
          <div className="flex space-x-3 justify-center">
            <button className="bg-black text-white px-4 py-2 rounded-lg  transition duration-200" onClick={openModal}>Create Party</button>
            <TaskModal isOpen={isModalOpen} onClose={closeModal} />
            <button className="bg-black text-white px-4 py-2 rounded-lg  transition duration-200">Join Party</button>
          </div>
        </div>
      </div>
    </div>
    </BaseLayout>
  ) : (
    <div className="flex flex-1 items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg border border-gray-200 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Please log in to view your profile</h2>
      </div>
    </div>
  );
};

export default ProfilePage;

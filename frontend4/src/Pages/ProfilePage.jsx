import React, { createElement } from 'react';
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import TaskModal from '../Components/TaskModal';
import BaseLayout from '../Layouts/BaseLayout';
import ChangePasswordModal from '../Components/ChangePasswordModal';

function verifyType(data) {
  if(typeof data === 'string') {
    return true;
  } 
  return false;
}

const ProfilePage = () => {
    const [tokenExists, setTokenExists] = useState(false);
    const [loggedUser, setLoggedUser] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const [titles, setTitles] = useState([]);
    const [createdDate, setCreatedDate] = useState('');

useEffect( () => {
  const username2 = process.env.REACT_APP_USERNAME; 
          const password2 = process.env.REACT_APP_PASSWORD; 
          const credentials = btoa(`${username2}:${password2}`);
        (async () => {
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
        (async () => {
          try {
            const response = await fetch(`http://localhost:8080/events/getUserEvents/${loggedUser}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${credentials}`
              },
              credentials: 'include'
            });
            const data = await response.json();
            console.log(data);
            setTitles(data.titles);
            setCreatedDate(data.createdDate);
          } catch (error) {
            console.log(error);
          }
        })();
}, [loggedUser, createdDate, titles]);
    const today = new Date().toString();
    
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false); 


    const [isModalOpen, setModalOpen] = useState(false);

    const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

    const openChangePasswordModal = () => setChangePasswordModalOpen(true);
    const closeChangePasswordModal = () => setChangePasswordModalOpen(false);
  return tokenExists ? (
    <div className="w-[100vw] h-[100vh] bg-white flex items-center justify-center bg-white">
    <BaseLayout>
    <div className="flex flex-1 items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg border border-gray-200 max-w-md w-full">
        <div className="flex flex-col items-center text-center mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">{loggedUser}'s Profile</h2>
          <div className="space-y-3">
            <p className="text-gray-600"><strong>Last Login:</strong> {today.slice(0,15)}</p>
            <p className="text-gray-600"><strong>Account Created:</strong> {verifyType(createdDate) ?  createdDate.slice(4,9) + ' ' + createdDate.slice(24,29) : '' }</p>
            <div>
              <strong className="text-gray-700">Parties:</strong>
              <ul className="list-disc ml-6 mt-2 text-gray-600">
                {titles && Array.isArray(titles) && titles.map((title, index) => (
  <li key={index}>{title}</li>
))}
              </ul>
            </div>
          </div>
        </div>

        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Enter the party name"
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 justify-center">
            <button className="bg-black text-white px-4 py-2 rounded-lg  transition duration-200 hover:scale-110 hover:transition-all hover:cursor-pointer" onClick={openModal} >Create Party</button>
            <TaskModal isOpen={isModalOpen} onClose={closeModal}/>
            <button className="bg-black text-white px-4 py-2 rounded-lg  transition duration-200 hover:scale-110 hover:transition-all hover:cursor-pointer" onClick={() => {
              (async () => {
                try {
                  const username2 = process.env.REACT_APP_USERNAME;
                  const password2 = process.env.REACT_APP_PASSWORD;
                  const credentials = btoa(`${username2}:${password2}`);
                  const response = await fetch(`http://localhost:8080/events/getUsers/${name}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Basic ${credentials}`
                    },
                    credentials: 'include'
                  });
                  const data = await response.json();
                  const allowedUsers = data.allowedUsers;
                  if(allowedUsers.includes(loggedUser)) {
                    navigate(`/camera/${name}}`);
                  } else {
                    alert("You are not allowed to join this party");
                  }
                } catch (error) {
                  alert("The party does not exist");
                }
              })();
            }}>Join Party</button>
            <button className="bg-black text-white px-4 py-2 rounded-lg  transition duration-200 hover:scale-110 hover:transition-all hover:cursor-pointer" onClick={openChangePasswordModal}>Change password</button>
            <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={closeChangePasswordModal} username={loggedUser}/>
             <button className="bg-black text-white px-4 py-2 rounded-lg  transition duration-200 hover:scale-110 hover:transition-all hover:cursor-pointer">Delete account</button>
          </div>
        </div>
      </div>
    </div>
    </BaseLayout>
    </div>
  ) : (
    <div className="flex flex-1 items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg border border-gray-200 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Please log in to view your profile</h2>
      </div>
    </div>
  );
};

export default ProfilePage;

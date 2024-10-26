import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [next, setNext] = useState(true);
    const [salt, setSalt] = useState(Number);

    const user = process.env.REACT_APP_USERNAME;
    const pass = process.env.REACT_APP_PASSWORD;

    // useEffect(() => {
    // setSalt(bcrypt.genSaltSync(10));
    // }, []);

    return (
        <>
        <div class="mx-auto my-10 max-w-md rounded-xl border px-4 py-10 text-gray-700 shadow-lg sm:px-8">
  <div class="mb-16 flex justify-between">
    <span class="font-bold"><span class="inline-block h-3 w-3 bg-blue-600"></span>Party planner</span>
    <span class="">Have account? <a href="/login" class="font-medium text-blue-600 hover:underline">Log in</a></span>
  </div>
  <p class="mb-5 text-3xl font-medium">Plan your party with us!</p>
  <p class="mb-6 text-sm">Register here:</p>
  <div class="mb-6">
    <div class="focus-within:border-b-blue-500 relative mb-3 flex overflow-hidden border-b-2 transition">
      <input type="username" id="username" onChange={(e) => setUsername(e.target.value)} class="w-full flex-1 appearance-none border-blue-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Username" />
    </div>
    <div class="focus-within:border-b-blue-500 relative mb-3 flex overflow-hidden border-b-2 transition">
      <input type="password" onChange={(e) => setPassword(e.target.value)} id="password" class="w-full flex-1 appearance-none border-blue-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Password" />
    </div>
  </div>
  <button class="mb-6 rounded-xl bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700"
  onClick={() => {
    axios.get("http://localhost:8080/user/find/" + username, {},{
      auth: {
        username: user,
        password: pass
      }
    }).then((response) => {
      console.log(response.data);
      if(response.data.succes === false){
        alert("User already exists");
        setNext(false);
      } else {
        alert("Passed1");
      }
    });
    if(next){
      axios.post("http://localhost:8080/user/register", {
        username: username,
        password: password
      }, {
        auth: {
          username: user,
          password: pass
        }
      }).then((response) => {
        if(response.data.code === 200){
          alert("User created successfully");
        } else {
          alert("Failed to create user");
        }
      });
    }
  }
  
  }>Get Started</button>
  <p class="">By signing up you are agreeing to our <a href="#" class="whitespace-nowrap font-medium text-gray-900 hover:underline">Terms and Conditions</a></p>
</div>
        </>
    );
};
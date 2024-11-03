import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const [next, setNext] = useState(true);
    return (
       <>
        <div class="flex h-screen w-screen items-center overflow-hidden px-2">
  <div class="relative flex w-96 flex-col space-y-5 rounded-lg border bg-white px-5 py-10 shadow-xl sm:mx-auto">
    <div class="-z-10 absolute top-4 left-1/2 h-full w-5/6 -translate-x-1/2 rounded-lg bg-black sm:-right-10 sm:top-auto sm:left-auto sm:w-full sm:translate-x-0"></div>
    <div class="mx-auto mb-2 space-y-3">
      <h1 class="text-center text-3xl font-bold text-gray-900">Sign in</h1>
      <p class="text-gray-500">Sign in to access your account</p>
    </div>
    <div>
      <div class="relative mt-2 w-full">
        <input type="text" id="username" onChange={(e) => setUsername(e.target.value)} class="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0" placeholder=" " />
        <label for="username" class="origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 absolute left-1 top-2 z-10 -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300">Enter your username</label>
      </div>
    </div>

    <div>
      <div class="relative mt-2 w-full">
        <input type="text" id="password" onChange={(e) => setPassword(e.target.value)} class="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0" placeholder=" " />
        <label for="password" class="origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 absolute left-1 top-2 z-10 -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300"> Enter Your Password</label>
      </div>
    </div>
    <div class="flex w-full items-center">
      <button class="shrink-0 inline-block w-36 rounded-lg bg-black py-3 font-bold text-white"
      onClick={() => {
        (async () => {
          const username2 = process.env.REACT_APP_USERNAME;
          const password2 = process.env.REACT_APP_PASSWORD;
          const credentials = btoa(`${username2}:${password2}`);
          try {
          const response = await fetch("http://localhost:8080/user/login", {
            method : "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Basic ${credentials}`
            },
            body: JSON.stringify({username, password}),
            credentials: 'include'
          });
          const data = await response.json();
          console.log(data);
          console.log(username, password);  
          if(data.success){
            navigate("/profile");
          } else {
            alert("Invalid credentials");
          }
        } catch (error) {
          alert("Error");
        }
        })();     
      }}>Login</button>
    </div>
    <p class="text-center text-gray-600">
      Don't have an account?
      <a href="/register" class="whitespace-nowrap font-semibold text-gray-900 hover:underline">Sign up</a>
    </p>
  </div>
</div>
       </> 
    );
};
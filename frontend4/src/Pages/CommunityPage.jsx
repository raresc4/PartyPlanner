import { useState,useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const reducer = (state, action) => {
    switch(action.type) {
        case 'updateTasks': {
            return action.payload;
        }
        case 'increment': {
            return state.map((task, index) => {
                if(index === action.index) {
                    if(task.counter+1 == 100) {
                        return { ...task, counter: 99 };
                    } else {
                    return { ...task, counter: task.counter + 1 };
                    }
                } else {
                    return task;
                }
            });
        }
        case 'decrement': {
            return state.map((task, index) => {
                if(index === action.index) {
                    if(task.counter-1 < 0) {
                        return { ...task, counter: 0 };
                    } else {
                    return { ...task, counter: task.counter - 1 };
                    }
                } else {
                    return task;
                }
            });
        }
        default: {
            return state;
        }
    }
}

export default function CommunityPage() {

    const [title, setTitle] = useState('');
    const [date , setDate] = useState('');
    const [location, setLocation] = useState('');
    const [hour, setHour] = useState(Number);

    const navigate = useNavigate();

    const initialTasks = [
       
    ];

    const getMonth = (date) => {
        switch(date.substring(3,5)) {
            case '01':
                return 'JAN';
            case '02':
                return 'FEB';
            case '03':
                return 'MAR';
            case '04':
                return 'APR';
            case '05':
                return 'MAY';
            case '06':
                return 'JUN';
            case '07':
                return 'JUL';
            case '08':
                return 'AUG';
            case '09':
                return 'SEP';
            case '10':
                return 'OCT';
            case '11':
                return 'NOV';
            case '12':
                return 'DEC';
            default:
                return 'JAN';
        }
    }

    const getTime = (hour) => {
        if(hour > 12) {
            return `${hour - 12}:00 PM`;
        } else {
            return `${hour}:00 AM`;
        }
    }

    const buildUsers = (involvedUsers, admin) => {
        let people = [];
        people.push({name : admin});
        involvedUsers.forEach(user => {
            people.push({name: user});
        });
        return people;
    }

    const buildTasks = (tasks) => {
        let taskList = [];
        tasks.forEach(task => {
            taskList.push({
                title: task[0],
                description: task[1],
                progress: task[2],
                assignee: task[3],
                counter : 0
            });
        });
        return taskList;
    };

    const [ users, setUsers] = useState([
        {
            name: 'John Doe'
        },
        {
            name: 'Jane Doe'
        },
        {
            name: 'John Doe'
        },
        {
            name: 'Jane Doe'
        }
    ]);

    const [state, dispatch] = useReducer(reducer, initialTasks);

    const handleIncrement = (index) => {
        dispatch({type : 'increment', index});
    };

    const handleUpdateTasks = (event) => {
    const newTasks = buildTasks(event.tasks); 
    dispatch({ type: 'updateTasks', payload: newTasks });
};

    const [loggedUser, setLoggedUser] = useState('');
    const [tokenExists, setTokenExists] = useState(false);
    const [allowedUser, setAllowedUser] = useState(false);
    const [eventExists, setEventExists] = useState(false);
    const [admin, setAdmin] = useState('');
    const { name } = useParams();
    
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
            console.log("Numele este : " + name.slice(0,-1));
            if(data.jwtToken != null){
            const decoded = jwtDecode(data.jwtToken);
            setTokenExists(true);
            setLoggedUser(decoded.sub);
            } else {
                console.log("No token");
            }
        })();
        (async () => {
            const username = process.env.REACT_APP_USERNAME; 
            const password = process.env.REACT_APP_PASSWORD; 
            const credentials = btoa(`${username}:${password}`);
            const response = await fetch(`http://localhost:8080/events/getUsers/${name.slice(0,-1)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                credentials: 'include'
            });
            const data = await response.json();
            if(data.success === true) {
            const allowedUsers = data.allowedUsers;
            console.log(allowedUsers);
            console.log(loggedUser);
            console.log(allowedUsers.includes(loggedUser));
            if(allowedUsers.includes(loggedUser)) {
                setAllowedUser(true);
            } else {
                setAllowedUser(false);
            }
        } else {
            setAllowedUser(false);
            console.log(data.message);
        }
        })();
        (async () => {
            const username = process.env.REACT_APP_USERNAME;
            const password = process.env.REACT_APP_PASSWORD;
            const credentials = btoa(`${username}:${password}`);
            const response = await fetch(`http://localhost:8080/events/getEvent/${name.slice(0,-1)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                credentials: 'include'
            });
            const data = await response.json();
            console.log(data.event);
            if(data.success === true) {
            const event = data.event;
            if(event.involvedUsers) {
            setUsers(buildUsers(event.involvedUsers, event.admin));
            } else {
                setUsers(buildUsers([], event.admin));
            }
            if(event.tasks) {
            dispatch({ type: 'updateTasks', payload: buildTasks(event.tasks) }); 
            }
            setTitle(event.title);
            setDate(event.date);
            setLocation(event.location);
            setHour(event.time);
            } else {
                console.log(data.message);
            }
        })();
        (async () => {
                    const username = process.env.REACT_APP_USERNAME;
                    const password = process.env.REACT_APP_PASSWORD;
                    const credentials = btoa(`${username}:${password}`);
                    try {
                        const response = await fetch(`http://localhost:8080/events/getAdmin/${name.slice(0,-1)}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Basic ${credentials}`
                        }});
                        const data = await response.json();
                        setAdmin(data.message);
                        console.log("adminul este : " + admin + " iar numele este : " + name.slice(0,-1));
                    } catch (error) {
                        alert("Error");
                    }
        } )();
    }, [loggedUser]);

    return tokenExists && allowedUser ? (
        <div className="w-[100vw] h-[100vh] flex flex-col items-start pt-2 pl-2 pr-2 justify-between">
            <Navbar/>
        <div className='w-full h-full flex flex-row justify-center items-start gap-x-8'>
            <div className='flex flex-col justify-start items-start h-full w-64 p-4 border-8 border-gray-600 gap-y-4'>
                <h1 className='text-2xl font-bold'> Members </h1>
                {users.map((user, index) => (
                    <div key={index} className='flex flex-row justify-start items-center gap-x-2'>
                        { user.name === admin ? 
                        <>
                        <p className="text-md w-full">{user.name} (admin)</p>
                        </> : 
                        <>
                        <p className="text-md w-full">{user.name}</p>
                        </>
}
                    </div>
                ))}
                
            </div>

            <div className="w-full flex flex-col justify-start items-center">
                <div className="w-full flex flex-col gap-y-4 border-gray-600 border-8 p-4">
                    <h1 className='text-2xl font-bold'> Tasks </h1>

                    {state.map((task, index) => (
                        <div key={index} className='w-full flex flex-col justify-start items-center'>
                            <div className='w-full flex flex-col gap-x-4 items-start justify-center'>
                                <h2 className='text-xl font-bold'>{task.title}</h2>
                                <p className='font-italic text-gray-600'>{task.description}</p>
                            </div>

                            
                            <div className='flex flex-row w-full gap-x-4'>
                                <div className='flex flex-row w-[90%] h-6 bg-gray-200 rounded-md '> 
                                    <div className='bg-green-200 h-full rounded-md' style={{ width: `${task.progress}%` }}/>
                                </div>
                                <p>
                                    {task.progress}%
                                </p>
                            </div>

                            <div key={index} className='w-full flex flex-row justify-start items-center'>
                                <p>{task.assignee}</p>
                                {(task.assignee === loggedUser || loggedUser === admin)   && <>
                                        <button className="shrink-20 inline-block w-40 m-2 rounded-lg bg-black py-2 font-bold text-white"
                                onClick={() => {
                                    (async () => {
                                        const username = process.env.REACT_APP_USERNAME;
                                        const password = process.env.REACT_APP_PASSWORD;
                                        const credentials = btoa(`${username}:${password}`);
                                        try  {
                                            const response = await fetch("http://localhost:8080/events/markAsDone", {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Basic ${credentials}`
                                            },
                                            body: JSON.stringify({roomName : name.slice(0,-1), taskName: task.title}),
                                            credentials: 'include'
                                        }     
                                    );
                                        const data = await response.json();
                                        if(data.success === true) {
                                            alert("Task marked as done");
                                        } else {
                                            alert("Error marking task as done");
                                        }
                                        window.location.reload();
                                        } catch (error) {
                                            alert("Error");
                                        }
                                        
                                    })();
                                }}
                                >Mark as done</button>
                                <button className="shrink-20 inline-block w-10 m-2 rounded-lg bg-black py-2 font-bold text-white"
                                onClick={() => {dispatch({type : 'decrement', index})}}>-</button>
                                <button className="shrink-20 inline-block w-10 m-2 rounded-lg bg-black py-2 font-bold text-white"
                                onClick={() => dispatch({ type: 'increment', index })}>+</button>
                                <div>{task.counter}</div>
                                <button className="shrink-20 inline-block w-40 m-2 rounded-lg bg-black py-2 font-bold text-white" 
                                onClick={() => {
                                    (async () => {
                                        const username = process.env.REACT_APP_USERNAME;
                                        const password = process.env.REACT_APP_PASSWORD;
                                        const credentials = btoa(`${username}:${password}`);
                                        try  {
                                        const response = await fetch("http://localhost:8080/events/updateTaskProgress", {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Basic ${credentials}`
                                            },
                                            body: JSON.stringify({roomName : name.slice(0,-1), taskName: task.title, progress: task.counter}),
                                            credentials: 'include'
                                        });
                                        const data = await response.json();
                                        if(data.success === true) {
                                            alert("Task progress updated");
                                            window.location.reload();
                                        } else {
                                            alert("Error updating task progress");
                                        }
                                    } catch (error) {
                                        alert("Error");
                                    }
                                    })();
                                }}>Set progress</button>
                                </>}
                            </div>
                            
                        </div>
                    ))}
                
                </div>
            </div>

            <div className='flex flex-col justify-start items-start h-full w-96 p-4 border-8 border-gray-600 gap-y-4'>
                <h1 className='text-2xl font-bold'> Current Event </h1>
                    <div className='w-full flex flex-row justify-start items-center gap-x-2'>
                        <div className='flex flex-col justify-center items-center text-lg font-bold'>
                            <p> {getMonth(date)} </p>
                            <p> {date.substring(0,2)} </p>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <p className='text-md w-full'>{title}</p>
                            <p className='text-xs'> {location} @ {getTime(hour)}</p>
                        </div>
                    </div>
                    <button class="shrink-0 inline-block w-56 rounded-lg bg-black py-3 font-bold text-white" onClick={() => {
                (async () => {
                    if(admin === loggedUser) {
                         const username = process.env.REACT_APP_USERNAME;
                        const password = process.env.REACT_APP_PASSWORD;
                        const credentials = btoa(`${username}:${password}`);
                    try {
                        const response = await fetch(`http://localhost:8080/events/deleteEvent/${name.slice(0,-1)}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Basic ${credentials}`
                        }});
                        const data = await response.json();
                        console.log(data);
                        if(data.success === true) {
                            navigate('/profile');
                        } else {
                            alert("Error deleting event");
                        }
                    } catch (error) {
                        alert("Error");
                    }
                } else {
                    alert("You are not the admin of this event");
                }
                })();  
                     }}>Mark event as done</button>
            </div>
        </div>
        <Footer/>
        </div>
    ) : (
        <div className='w-full h-full flex flex-row justify-center items-center'>
            <h1 className='text-4xl font-bold'> LOADING . . . </h1>
        </div>
    );
}
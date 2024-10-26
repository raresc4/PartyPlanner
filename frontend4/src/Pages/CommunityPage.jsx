import { useState,useEffect } from "react";
import Cookies from 'js-cookie';

export default function CommunityPage() {
    const [ users, setUsers] = useState([
        {
            name: 'John Doe'
        },
    ]);

    const [jwtToken , setJwtToken] = useState('');
    
    useEffect(() => {
        const token = Cookies.get('token');
        console.log(token);
    }, []);

    const [ tasks, setTasks ] = useState([
        {
            title: 'Task 1',
            description: 'Description 1',
            progress: 50,
            assignee: 'john_doe',
        }, 
        {
            title: 'Task 2',
            description: 'Description 2',
            progress: 50,
            assignee: 'jane_doe',
        },
        {
            title: 'Task 3',
            description: 'Description 3',
            progress: 50,
            assignee: 'john_doe',
        }, 
        {
            title: 'Task 4',
            description: 'Description 4',
            progress: 50,
            assignee: 'jane_doe',
        },
        {
            title: 'Task 5',
            description: 'Description 5',
            progress: 50,
            assignee: 'john_doe',
        }, 
        {
            title: 'Task 6',
            description: 'Description 6',
            progress: 50,
            assignee: 'jane_doe',
        }
    ]);


    return (
        <div className='w-full h-full flex flex-row justify-center items-start gap-x-8'>
            <div className='flex flex-col justify-start items-start h-full w-64 p-4 border-8 border-gray-600 gap-y-4'>
                <h1 className='text-2xl font-bold'> Members </h1>
                {users.map((user, index) => (
                    <div key={index} className='flex flex-row justify-start items-center gap-x-2'>
                        <p className="text-md w-full">{user.name}</p>
                    </div>
                ))}
                
            </div>

            <div className="w-full flex flex-col justify-start items-center">
                <div className="w-full flex flex-col gap-y-4 border-gray-600 border-8 p-4">
                    <h1 className='text-2xl font-bold'> Tasks </h1>

                    {tasks.map((task, index) => (
                        <div key={index} className='w-full flex flex-col justify-start items-center'>
                            <div className='w-full flex flex-col gap-x-4 items-start justify-center'>
                                <h2 className='text-xl font-bold'>{task.title}</h2>
                                <p className='font-italic text-gray-600'>{task.description}</p>
                            </div>

                            {/* Progress bar */}
                            <div className='flex flex-row w-full gap-x-4'>
                                <div className='flex flex-row w-[90%] h-6 bg-gray-200 rounded-md '> 
                                    <div className='w-[50%] bg-green-200 h-full rounded-md '/>
                                </div>
                                <p>
                                    {task.progress}%
                                </p>
                            </div>

                            <div key={index} className='w-full flex flex-row justify-start items-center'>
                               
                                <p>{task.assignee}</p>
                            </div>
                            
                        </div>
                    ))}
                
                </div>
            </div>

            <div className='flex flex-col justify-start items-start h-full w-96 p-4 border-8 border-gray-600 gap-y-4'>
                <h1 className='text-2xl font-bold'> Events </h1>
                {users.map((user, index) => (
                    <div key={index} className='w-full flex flex-row justify-start items-center gap-x-2'>
                        <div className='flex flex-col justify-center items-center text-lg font-bold'>
                            <p> NOV </p>
                            <p> 19 </p>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <p className='text-md w-full'>Event 1</p>
                            <p className='text-xs'> UPT Gardens @ 9:00 PM</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
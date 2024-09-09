import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useState , useEffect} from 'react';

export function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [taskcount , setCount] = useState(0);
    
    const currUser = auth().currentUser;

    useEffect(()=>{
        if(currUser){
            const task = firestore().collection('users').doc(currUser.uid).collection('tasks');

            const subscribe = task.onSnapshot(result=>{
                if (result.empty) {
                    console.log('No tasks found for this user.');
                    setTasks([]);
                }else {
                    const tasksData = [];
                    result.forEach(doc => {
                      tasksData.push({ id: doc.id, ...doc.data() });
                    });
                    setTasks(tasksData);
                  }
            },error => {
                console.log('Snapshot error: ', error);
            });
            return () => subscribe();
        }
    },[currUser])

    useEffect(()=>{
        if (currUser) {
            const taskdata = firestore().collection('users').doc(currUser.uid).collection('tasks');

            const subscribe = taskdata.onSnapshot(result=>{
                if(result.empty){
                    console.log('No tasks found for this user.');
                    setCount(0);
                }else{
                    const numtask = result.size;
                    setCount(numtask)
                    console.log('Real-time task count: ', numtask);
                }
            },error => {
                console.log('Snapshot error: ', error);
            });
        return ()=>subscribe();
        }
    },[tasks])

    const addNewTask = async(color,name,details,duedate,reminders,flag,tag) =>{
      if (name.length>0 && name.trim() && currUser) {
        try {
            const addtodb = firestore().collection('users').doc(currUser.uid).collection('tasks');
            const taskData = {
                color,
                name,
                details,
                duedate,
                reminders,
                flag,
                tag};

            Object.keys(taskData).forEach(key => {
                if (taskData[key] === undefined) {
                    delete taskData[key];
                }
            });

            await addtodb.add(taskData);
            console.log('Added to database');
            
        } catch (error) {
            console.log(error);
            console.log('Not added to database');

        }
      }else {
        console.log('Enter a task name properly!');
      }
    }
  
  
  
    const updateTask = async(color,taskid,name,details,duedate,reminders,flag,tag) => {
        try {
        const addtodb = await firestore().collection('users').doc(currUser.uid).collection('tasks').doc(taskid);
        const taskData = {
            color,
            name,
            details,
            duedate,
            reminders,
            flag,
            tag};

        Object.keys(taskData).forEach(key => {
            if (taskData[key] === undefined || taskData[key] === null) {
                delete taskData[key];
            }
        });
        console.log(taskData);

        await addtodb.update(taskData);
        console.log('added');    
            
        } catch (error) {
            console.log(error);
            console.log('not updated');
        }
    };

  
    const deleteTask = async(taskid) => {
        try {
            await firestore().collection('users').doc(currUser.uid).collection('tasks').doc(taskid).delete();
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskid));
        } catch (error) {
            console.log('Error on deletion: ', error);
        }
     
    };
  
    return {
        tasks,
        taskcount,
        addNewTask,
        updateTask,
        deleteTask
    };
  }

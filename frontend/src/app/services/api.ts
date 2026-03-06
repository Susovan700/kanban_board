import axios from 'axios';
import { Task, Board } from '../types/index';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
})

export async function getBoardData(){
    const response = await api.get('/board');
    return response.data;
}

export async function fetchAllTasks(){
    const response = await api.get('/tasks')
    return response.data;
}

export async function createNewTask(taskData: any){
    const response = await api.post('/tasks/add', taskData)
    return response.data;
}

export async function removeTask(id : string){
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
}

export async function updateTaskPosition(id: string, status: string, position: number) {
  const dataToSend = { 
    newStatus: status, 
    newPosition: position 
  };
  
  const response = await api.patch(`/tasks/move/${id}`, dataToSend);
  return response.data;
}

export default api;
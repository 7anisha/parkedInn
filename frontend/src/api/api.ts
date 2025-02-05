import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {}),
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    },
});

export default API
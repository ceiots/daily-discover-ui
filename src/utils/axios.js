import axios from 'axios';
import { API_BASE_URL } from '../config';

const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'any_value'
    }
});

export default instance;

// Wondering if there is a way to read CSV files from JS, it should be.
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    responseType: 'json',
});

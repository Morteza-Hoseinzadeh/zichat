import axios from 'axios';
import { getToken } from '../functions/auth/service';

const token = getToken();
const axiosInstance: any = axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
});

export default axiosInstance;

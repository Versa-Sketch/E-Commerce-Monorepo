import axios from 'axios';
import { API_CONFIG } from '../Common/Constants';
import { applyRequestMiddleware, applyResponseMiddleware } from './middleware';
export const AppClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
applyRequestMiddleware(AppClient);
applyResponseMiddleware(AppClient);
export default AppClient;

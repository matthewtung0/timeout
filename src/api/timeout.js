import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    baseURL: 'http://63f7-2603-8000-bd00-a3cc-b1fd-21ef-d9f0-4872.ngrok.io'
})

instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            config.headers.Authorization = `Bearer notoken`;
        }
        return config;
    },
    (err) => {
        return Promise.reject("Axios interceptor error: " + err);
    }
);

export default instance;
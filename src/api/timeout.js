import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    baseURL: 'https://707e-98-149-204-129.ngrok.io'
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
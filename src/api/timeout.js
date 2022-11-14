import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    baseURL: 'https://c7be-50-53-51-19.ngrok.io'
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
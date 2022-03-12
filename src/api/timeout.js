import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    baseURL: 'http://74c9-2603-8000-bd00-a3cc-6df4-a56a-c542-52c4.ngrok.io'
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
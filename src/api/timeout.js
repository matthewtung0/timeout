import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    //baseURL: 'https://0bcc-76-88-125-70.ngrok.io'
    baseURL: 'http://timeoutserverdev-env.eba-ufn4rhwk.us-east-1.elasticbeanstalk.com:80/'
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
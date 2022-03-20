import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from './createDataContext';
import timeoutApi from '../api/timeout';
import { navigate } from '../navigationRef'

const authReducer = (state, action) => {
    switch (action.type) {
        case 'signin':
            return { ...state, token: action.payload };
        case 'add_error':
            return { errorMessage: '', errorMessage: action.payload };
        case 'clear_error_message':
            return { ...state, errorMessage: '' }
        case 'signout':
            return { token: null, errorMessage: '' }
        default:
            return state
    }
}

const tryLocalSignin = dispatch => async () => {
    const token = await AsyncStorage.getItem('token')
    if (token) {
        dispatch({ type: 'signin', payload: token });
        console.log("Local sign in succeeded");
        return 1
        //navigate('profileFlow');
    } else {
        console.log("Local sign in failed - not signed in!");
        return 0
        //navigate('loginFlow');
    }
};

const signupValidation = (email, password) => {
    // email format [anystring]@[anystring].[anystring]
    let email_re = /\S+@\S+\.\S+/;

    // pw between 6 to 20 characters, at least 1 numeric digit, 1 uppercase, 1 lowercase
    let password_re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return (email_re.test(email) && password_re.test(password));
}

const signup = (dispatch) => async ({ email, password, username, firstName, lastName }) => {
    if (!signupValidation(email, password)) {
        dispatch({ type: 'add_error', payload: 'Invalid username or password!' })
        return
    }
    try {
        const response = await timeoutApi.post('/signup', { email, password, username, firstName, lastName });
        res = await AsyncStorage.setItem('token', response.data.token);

        //sign up successful
        dispatch({ type: 'signin', payload: response.data.token });

        navigate('profileFlow');
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Something went wrong with sign up' })
    }
};

const clearErrorMessage = dispatch => () => {
    dispatch({ type: 'clear_error_message' })
}



const signin = (dispatch) => async ({ email, password }) => {
    console.log("signin client side");
    try {
        const response = await timeoutApi.post('/signin', { email, password });
        await AsyncStorage.setItem('token', response.data.token);
        console.log("SIGN IN SUCCESSFUL. TOKEN IS " + response.data.token);
        dispatch({ type: 'signin', payload: response.data.token });
        navigate('profileFlow');
    } catch (err) {
        console.log(err)
        dispatch({ type: 'add_error', payload: 'Something went wrong with sign in' })
    }
};

const signout = dispatch => async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'signout' });
    navigate('friendFeedFlow');
};

const forgot_password = (dispatch) => async ({ email }) => {
    try {
        const response = await timeoutApi.post('/forgot_password', { email });
        navigate('SignIn')
    } catch (err) {
        console.log("FORGOT PASSWORD ERROR");
        console.log(err)
    }
}

export const { Provider, Context } = createDataContext(
    authReducer,
    { signup, signin, signout, clearErrorMessage, tryLocalSignin, forgot_password },
    { token: null, errorMessage: '' }
)
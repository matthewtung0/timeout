import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from './createDataContext';
import timeoutApi from '../api/timeout';
import { navigate } from '../navigationRef'

const authReducer = (state, action) => {
    switch (action.type) {
        case 'signin':
            return { ...state, token: action.payload, isLoading: false };
        case 'add_error':
            return { ...state, errorMessage: action.payload };
        case 'clear_error_message':
            return { ...state, errorMessage: '' }
        case 'signout':
            return { token: null, errorMessage: '' }

        case 'tempVarSet':
            return { ...state, tempVar: false }
        case 'doneLoading':
            return { ...state, doneLoading: true }
        case 'resetDoneLoading':
            return { ...state, doneLoading: false }
        default:
            return state
    }
}

const tryLocalSignin = dispatch => async () => {
    console.log("Trying local sign in");
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

const signup = (dispatch) => async ({ email, password, username, firstName, lastName, categoryArr }) => {
    /*if (!signupValidation(email, password)) {
        dispatch({ type: 'add_error', payload: 'Invalid username or password!' })
        return
    }*/
    try {
        const response = await timeoutApi.post('/signup', { email, password, username, firstName, lastName, categoryArr });
        res = await AsyncStorage.setItem('token', response.data.token);

        //sign up successful
        dispatch({ type: 'signin', payload: response.data.token });

        //navigate('profileFlow');
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Something went wrong with sign up' })
    }
};

const clearErrorMessage = dispatch => () => {
    dispatch({ type: 'clear_error_message' })
}

const signin = (dispatch) => async (email, password, callback = null) => {
    console.log("signin client side");
    try {

        const response = await timeoutApi.post('/signin', { email, password });
        await AsyncStorage.setItem('token', response.data.token);
        dispatch({ type: 'signin', payload: response.data.token });
        console.log("SIGN IN SUCCESSFUL. TOKEN IS " + response.data.token);

        //navigate('profileFlow');
        if (callback) { callback() }
        else {
            console.log("no callback?? wtf")
        }


    } catch (err) {
        console.log(err)
        dispatch({ type: 'add_error', payload: 'Something went wrong with sign in' })
    }
};

const changePassword = (dispatch) => async (oldPassword, newPassword, callback) => {
    try {
        console.log("passing old pw", oldPassword);
        console.log("passing new pw", newPassword);
        const response = await timeoutApi.patch('/changePasswordApp', { oldPassword, newPassword });
        //await AsyncStorage.setItem('token', response.data.token);
        //console.log("password change successful. new token is " + response.data.token);
        callback();
    } catch (err) {
        console.log(err)
        dispatch({ type: 'add_error', payload: 'Problem changing password' })
    }
}

const signout = dispatch => async (callback = null) => {
    console.log("SIGNING OUT")

    // need to clear out the user info
    dispatch({ type: 'signout' });
    await AsyncStorage.removeItem('token');

    if (callback) { callback() }

    //navigate('SignIn');
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

const tempVarSet = (dispatch) => () => {
    dispatch({ type: 'tempVarSet' });
}

const doneLoading = (dispatch) => () => {
    dispatch({ type: 'doneLoading' })
}
const resetDoneLoading = (dispatch) => () => {
    console.log("resetting done loadin")
    dispatch({ type: 'resetDoneLoading' })
}

export const { Provider, Context } = createDataContext(
    authReducer,
    {
        signup, signin, signout, clearErrorMessage,
        tryLocalSignin, forgot_password, tempVarSet, changePassword, doneLoading, resetDoneLoading
    },
    {
        token: null,
        errorMessage: '',
        isLoading: true,
        tempVar: true,
        doneLoading: false,
    }
)
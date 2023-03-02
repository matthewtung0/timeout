import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from './createDataContext';
import timeoutApi from '../api/timeout';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'signin':
            return { ...state, token: action.payload.token, isLoading: false, showOnboarding: action.payload.showOnboarding };
        case 'set_token':
            return { ...state, token: action.payload.token, isLoading: false, showOnboarding: action.payload.showOnboarding }
        case 'add_error':
            return { ...state, errorMessage: action.payload };
        case 'clear_error_message':
            return { ...state, errorMessage: '' }
        case 'signout':
            return { token: null, errorMessage: '', showOnboarding: false, }
        case 'tempVarSet':
            return { ...state, tempVar: false }
        case 'doneLoading':
            return { ...state, doneLoading: true }
        case 'resetDoneLoading':
            return { ...state, doneLoading: false }
        case 'setShowOnboarding':
            return { ...state, showOnboarding: action.payload }
        default:
            return state
    }
}

const tryLocalSignin = dispatch => async () => {
    console.log("Trying local sign in");
    const token = await AsyncStorage.getItem('token')
    if (token) {
        dispatch({ type: 'signin', payload: { token: token, showOnboarding: false } });
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

const signup = (dispatch) => async ({ email, password, username, firstName, lastName, categoryArr, bio, callback, errorCallback }) => {
    try {
        const response = await timeoutApi.post('/signup',
            { email, password, username, firstName, lastName, categoryArr, bio },
            { timeout: 15000 });
        var token = response.data.token
        res = await AsyncStorage.setItem('token', token);

        //sign up successful
        if (callback) { callback(token) }
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Something went wrong with sign up' })
        if (errorCallback) { errorCallback() }
    }
};

const setToken = dispatch => async (token) => {
    console.log("SIGN UP SUCCESSFUL. UPDATING TOKEN WITH ", token)
    try {
        dispatch({ type: 'set_token', payload: { token: token, showOnboarding: true } });
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Something went wrong setting token' })
    }
}

const clearErrorMessage = dispatch => () => {
    dispatch({ type: 'clear_error_message' })
}

const signin = (dispatch) => async (email, password, callback = null, callbackFail = null) => {
    console.log("signin client side");
    try {

        const response = await timeoutApi.post('/signin', { email, password });
        await AsyncStorage.setItem('token', response.data.token);

        dispatch({ type: 'signin', payload: { token: response.data.token, showOnboarding: true } });
        console.log("SIGN IN SUCCESSFUL. TOKEN IS " + response.data.token);

        if (callback) { callback() }

    } catch (err) {
        console.log(err)
        dispatch({ type: 'add_error', payload: 'Something went wrong with sign in' })
        if (callbackFail) { callbackFail() }
    }
};

const changePassword = (dispatch) => async (oldPassword, newPassword, callback = null, errorCallback = null) => {
    try {
        console.log("passing old pw", oldPassword);
        console.log("passing new pw", newPassword);
        const response = await timeoutApi.patch('/changePasswordApp', { oldPassword, newPassword });
        //await AsyncStorage.setItem('token', response.data.token);
        //console.log("password change successful. new token is " + response.data.token);
        if (callback) { callback(); }

    } catch (err) {
        console.log(err)
        alert("Something went wrong. Please check your password or try again later.")
        if (errorCallback) { errorCallback() }
        //dispatch({ type: 'add_error', payload: 'Problem changing password' })
    }
}


const signout = dispatch => async (callback = null) => {
    console.log("SIGNING OUT")
    try {
        const response = await timeoutApi.patch('/self_user_token');
    } catch (err) {
        console.log(err)
    }

    // need to clear out the user info
    dispatch({ type: 'signout' });
    await AsyncStorage.removeItem('token');

    if (callback) { callback() }

    //navigate('SignIn');
};

const forgot_password = (dispatch) => async (email, callback = null) => {
    try {
        //const response = await timeoutApi.post('/forgot_password', { email });
        const response = await timeoutApi.post('/forgot_password', { email });
        if (callback) { callback() }
    } catch (err) {
        console.log("FORGOT PASSWORD ERROR");
        console.log(err)
    }
}

const tempVarSet = (dispatch) => () => {
    dispatch({ type: 'tempVarSet' });
}

const setShowOnboarding = (dispatch) => (bool_) => {
    dispatch({ type: 'setShowOnboarding', payload: bool_ })
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
        tryLocalSignin, forgot_password, tempVarSet, changePassword, doneLoading, resetDoneLoading,
        setShowOnboarding, setToken,
    },
    {
        token: null,
        errorMessage: '',
        isLoading: true,
        tempVar: true,
        doneLoading: false,
        showOnboarding: false,
    }
)
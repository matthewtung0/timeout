import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';

const userReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_self':
            return action.payload
        case 'add_error':
            return { errorMessage: '', errorMessage: action.payload };
        default:
            return state;
    }
}

const fetchSelf = dispatch => async () => {
    try {
        const response = await timeoutApi.get('/self_user')
        dispatch({ type: 'fetch_self', payload: response.data })
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Must be signed in!' })
    }


}

const fetchFriends = dispatch => async () => { };

const fetchEveryone = dispatch => async () => { };

const postSelf = dispatch => async () => { }

const editSelf = dispatch => async () => { }

const deleteSelf = dispatch => async () => { }

const editFriends = dispatch => async () => { }


export const { Provider, Context } = createDataContext(
    userReducer,
    { fetchSelf },
    []
);
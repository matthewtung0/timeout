import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';

const sessionReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_sessions':
            return action.payload
        default:
            return state;
    }
}


const fetchSessions = dispatch => async () => {
    const response = await timeoutApi.get('/sessions')
    dispatch({ type: 'fetch_sessions', payload: response.data })
}

const postSession = dispatch => async () => { };

const fetchFriendSession = dispatch => async () => { };

const fetchOwnSession = dispatch => async () => { };

const DeleteSession = dispatch => async () => { };

const fetchAllSession = dispatch => async () => { };





export const { Provider, Context } = createDataContext(
    sessionReducer,
    { fetchSessions },
    []
);
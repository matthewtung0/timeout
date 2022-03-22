import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';

const userReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_self':
            return { ...state, self_info: action.payload }
        case 'add_error':
            console.log(state);
            return { ...state, errorMessage: action.payload };
        case 'request_outgoing_reqs':
            return { ...state, outgoingFriendReqs: action.payload }
        case 'request_incoming_reqs':
            return { ...state, incomingFriendReqs: action.payload }
        case 'accept_friend':
            console.log("reached accept friend reducer");
            return {
                ...state, incomingFriendReqs: state.incomingFriendReqs.filter((req) => req.friend_a != action.payload.idToAccept),
                friends: [...state.friends, { userId: action.payload.idToAccept, username: action.payload.usernameToAccept }]
            }
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

const requestFriend = dispatch => async (codeToRequest, callback) => {
    try {
        const response = await timeoutApi.post('/requestFriend', { codeToRequest })
        dispatch({ type: 'request_friend', payload: response.data })
        callback()
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Problem requesting friend!' })
    }
}

const acceptFriendRequest = dispatch => async (idToAccept, usernameToAccept, callback) => {
    try {
        console.log("pre api");
        await timeoutApi.post('/acceptFriendRequest', { idToAccept })
        console.log("trying dispatch");
        dispatch({ type: 'accept_friend', payload: { idToAccept, usernameToAccept } })
        console.log("done dispatch")
        callback()
    } catch (err) {
        console.log("ERROR adding friend");
        dispatch({ type: 'add_error', payload: 'Problem accepting friend!' })
    }
}

const fetchOutgoingRequests = dispatch => async (callback) => {
    try {
        const response = await timeoutApi.get('/friendRequestsOutgoing')
        dispatch({ type: 'request_outgoing_reqs', payload: response.data })
        callback()
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Problem getting outgoing friend reqs!' })
    }
}

const fetchIncomingRequests = dispatch => async (callback) => {
    try {
        const response = await timeoutApi.get('/friendRequestsIncoming')
        dispatch({ type: 'request_incoming_reqs', payload: response.data })
        callback()
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Problem getting incoming friend reqs!' })
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
    { fetchSelf, requestFriend, fetchOutgoingRequests, fetchIncomingRequests, acceptFriendRequest },
    {
        self_info: [],
        outgoingFriendReqs: [],
        incomingFriendReqs: [],
        friends: [],
    }
);
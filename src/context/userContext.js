import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';

const userReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_self':
            return { ...state, self_info: action.payload }
        case 'add_error':
            console.log("ERROR: ", action.payload)
            return { ...state, errorMessage: action.payload };
        case 'request_outgoing_reqs':
            return { ...state, outgoingFriendReqs: action.payload, errorMessage: '' }
        case 'request_incoming_reqs':
            return { ...state, incomingFriendReqs: action.payload, errorMessage: '' }
        case 'accept_friend':
            return {
                ...state, incomingFriendReqs: state.incomingFriendReqs.filter((req) => req.friend_a != action.payload.idToAccept),
                friends: [...state.friends, { userId: action.payload.idToAccept, username: action.payload.usernameToAccept }]
                , errorMessage: ''
            }
        case 'reject_friend':
            return {
                ...state, incomingFriendReqs: state.incomingFriendReqs.filter((req) => req.friend_a != action.payload.idToReject),
                errorMessage: ''
            }
        case 'fetch_friends':
            return {
                ...state, friends: action.payload, errorMessage: ''
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
        if (response.status == 403) {
            dispatch({ type: 'add_error', payload: response.data.error })
        } else {
            dispatch({ type: 'add_error', payload: response.data.error })
        }

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
        console.log("ERROR accepting friend:", err);
        dispatch({ type: 'add_error', payload: 'Problem accepting friend!' })
    }
}

const rejectFriendRequest = dispatch => async (idToReject, callback) => {
    try {
        await timeoutApi.post('/rejectFriendRequest', { idToReject })
        dispatch({ type: 'reject_friend', payload: { idToReject } })
        callback()
    } catch (err) {
        console.log("ERROR rejecting friend request", err);
        dispatch({ type: 'add_error', payload: 'Problem rejecting friend!' })
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

const fetchFriends = dispatch => async (callback) => {
    try {
        const response = await timeoutApi.get('/friendsList')
        console.log("response is:", response.data);
        dispatch({ type: 'fetch_friends', payload: response.data })
        callback()
    } catch (err) {
        console.log("Problem fetching friends:", err.stack())
        dispatch({ type: 'add_error', payload: 'Problem getting friends!' })
    }
};

const fetchEveryone = dispatch => async () => { };

const postSelf = dispatch => async () => { }

const editSelf = dispatch => async () => { }

const deleteSelf = dispatch => async () => { }

const editFriends = dispatch => async () => { }


export const { Provider, Context } = createDataContext(
    userReducer,
    {
        fetchSelf, requestFriend, fetchOutgoingRequests, fetchIncomingRequests,
        acceptFriendRequest, rejectFriendRequest, fetchFriends
    },
    {
        self_info: [],
        outgoingFriendReqs: [],
        incomingFriendReqs: [],
        friends: [],
        errorMessage: '',
    }
);
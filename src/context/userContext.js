import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';

const userReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_self':
            return {
                ...state,
                firstName: action.payload.first_name,
                lastName: action.payload.last_name,
                username: action.payload.username
            }
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
        case 'edit_self':
            return {
                ...state,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                username: action.payload.username,
                responseMessage: 'Info updated!',
            }
        case 'clear_response':
            return { ...state, responseMessage: '', errorMessage: '' }
        default:
            return state;
    }
}

const fetchSelf = dispatch => async () => {
    console.log("fetching self in profile screen")
    try {
        const response = await timeoutApi.get('/self_user')
        console.log("setting self info to", response.data)
        dispatch({ type: 'fetch_self', payload: response.data })
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Must be signed in!' })
    }
}

const requestFriend = dispatch => async (codeToRequest, callback = null) => {
    try {
        const response = await timeoutApi.post('/requestFriend', { codeToRequest })
        if (response.status == 403) {
            dispatch({ type: 'add_error', payload: response.data.error })
        } else {
            dispatch({ type: 'add_error', payload: response.data.error })
        }

        if (callback) { callback() }
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Problem requesting friend!' })
    }
}

const acceptFriendRequest = dispatch => async (idToAccept, usernameToAccept, callback = null) => {
    try {
        await timeoutApi.post('/acceptFriendRequest', { idToAccept })
        dispatch({ type: 'accept_friend', payload: { idToAccept, usernameToAccept } })
        if (callback) { callback() }

    } catch (err) {
        console.log("ERROR accepting friend:", err);
        dispatch({ type: 'add_error', payload: 'Problem accepting friend!' })
    }
}

const rejectFriendRequest = dispatch => async (idToReject, callback = null) => {
    try {
        await timeoutApi.post('/rejectFriendRequest', { idToReject })
        dispatch({ type: 'reject_friend', payload: { idToReject } })
        if (callback) { callback() }
    } catch (err) {
        console.log("ERROR rejecting friend request", err);
        dispatch({ type: 'add_error', payload: 'Problem rejecting friend!' })
    }
}

const fetchOutgoingRequests = dispatch => async (callback = null) => {
    try {
        const response = await timeoutApi.get('/friendRequestsOutgoing')
        dispatch({ type: 'request_outgoing_reqs', payload: response.data })
        if (callback) { callback() }
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Problem getting outgoing friend reqs!' })
    }
}

const fetchIncomingRequests = dispatch => async (callback = null) => {
    try {
        const response = await timeoutApi.get('/friendRequestsIncoming')
        dispatch({ type: 'request_incoming_reqs', payload: response.data })
        if (callback) { callback() }
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Problem getting incoming friend reqs!' })
    }
}

const fetchFriends = dispatch => async (callback = null) => {
    try {
        const response = await timeoutApi.get('/friendsList')
        dispatch({ type: 'fetch_friends', payload: response.data })
        if (callback) { callback() }

    } catch (err) {
        console.log("Problem fetching friends:", err)
        dispatch({ type: 'add_error', payload: 'Problem getting friends!' })
    }
};

const fetchEveryone = dispatch => async () => { };

const postSelf = dispatch => async () => { }

const editSelf = dispatch => async ({ firstName, lastName, username }) => {
    try {
        const response = await timeoutApi.patch('/self_user', { firstName, lastName, username })
        dispatch({ type: 'edit_self', payload: { firstName, lastName, username } })
        //callback()
    } catch (err) {
        console.log("Problem editing self user info:", err)
        dispatch({ type: 'add_error', payload: 'Problem updating info!' })
    }
}

const clearResponseMessage = dispatch => () => {
    dispatch({ type: 'clear_response', payload: {} })
}

const deleteSelf = dispatch => async () => { }

const editFriends = dispatch => async () => { }


export const { Provider, Context } = createDataContext(
    userReducer,
    {
        fetchSelf, requestFriend, fetchOutgoingRequests, fetchIncomingRequests,
        acceptFriendRequest, rejectFriendRequest, fetchFriends, editSelf,
        clearResponseMessage
    },
    {
        outgoingFriendReqs: [],
        incomingFriendReqs: [],
        friends: [],
        errorMessage: '',
        firstName: '',
        lastName: '',
        username: '',
        responseMessage: '',
    }
);
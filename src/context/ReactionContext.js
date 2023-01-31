import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';

const reactionReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_sessions':
            return { ...state, userSessions: action.payload }
        case 'fetch_reaction':
            return { ...state, userReaction: action.payload }
        case 'fetch_likers':
            return { ...state }
        case 'preemptive_like':
            return {
                ...state, userReaction: [...state.userReaction, { activity_id: action.payload.activity_id }],
                userSessions: state.userSessions.map(item => {
                    if (item.activity_id == action.payload.activity_id) {
                        return { ...item, reaction_count: item.reaction_count + 1 }
                    }
                    return item;
                })
            }
        case 'preemptive_unlike':
            return {
                ...state, userReaction: state.userReaction.filter((req) => req.activity_id != action.payload.activity_id),
                userSessions: state.userSessions.map(item => {
                    if (item.activity_id == action.payload.activity_id) {
                        console.log("UPDATING", item);
                        return { ...item, reaction_count: item.reaction_count - 1 }
                    }
                    return item;
                })
            }
        case 'react_to_activity':
            console.log("This was an unlike:", action.payload.wasUnliked);
            if (!action.payload.wasUnliked) { //is a like
                return {
                    ...state,
                    userReaction: [...state.userReaction, { activity_id: action.payload.activity_id }],
                    userSessions: state.userSessions.map(item => {
                        if (item.activity_id == action.payload.activity_id) {
                            return { ...item, reaction_count: item.reaction_count + 1 }
                        }
                        return item;
                    })
                }
            } else { // is an unlike
                return {
                    ...state,
                    userReaction: state.userReaction.filter((req) => req.activity_id != action.payload.activity_id),
                    userSessions: state.userSessions.map(item => {
                        if (item.activity_id == action.payload.activity_id) {
                            console.log("UPDATING", item);
                            return { ...item, reaction_count: item.reaction_count - 1 }
                        }
                        return item;
                    })
                }
            }
        case 'clear_context':
            return {
                userSessions: [],
                userReaction: [],
                userNotifications: [],
            }
        default:
            return state;
    }
}


const fetchSessions = dispatch => async (friends) => {
    // clean up friends array
    var friendsArr = []
    for (var i in friends) {
        friendsArr.push(friends[i]['friend'])
    }

    const response = await timeoutApi.get('/sessionFeed', { params: { friends: friendsArr } })
    //console.log("got this response", response.data)
    dispatch({ type: 'fetch_sessions', payload: response.data })

    //dispatch({ type: 'fetch_self_sessions', payload: response.data })

    return response.data
}


const fetchSessionsNextBatch = dispatch => async (startIndex = 0, friends) => {
    var friendsArr = []
    for (var i in friends) {
        friendsArr.push(friends[i]['friend'])
    }
    const response = await timeoutApi.get('/sessionFeed', { params: { startIndex, friends: friendsArr } })

    dispatch({ type: 'fetch_sessions_batch', payload: response.data })

    //dispatch({ type: 'fetch_self_sessions_batch', payload: response.data })


    //console.log(response.data)
    return response.data
}

// get activities that user has reacted on
const fetchUserReactions = dispatch => async () => {
    try {
        console.log("Fetching user reactions!")
        const response = await timeoutApi.get('/interaction')
        dispatch({ type: 'fetch_reaction', payload: response.data })
    } catch (err) {
        console.log("problem fetching user reactions", err);
    }
}

const fetchLikersOfActivity = dispatch => async (activity_id, callback = null, errorCallback = null) => {
    try {
        const response = await timeoutApi.get(`/interaction/reaction/${activity_id}`)
        console.log("Notifications: ", response.data)
        dispatch({ type: 'fetch_likers', payload: response.data })
        if (callback) { callback }
        return response.data;
    } catch (err) {
        console.log("problem fetching likes", err);
        if (errorCallback) { errorCallback }
    }
}

const reactToActivity = dispatch => async (activity_id, is_like, reactCallback = null) => {
    try {
        if (is_like) {
            dispatch({ type: 'preemptive_like', payload: { activity_id } })
        } else {
            dispatch({ type: 'preemptive_unlike', payload: { activity_id } })
        }
        const response = await timeoutApi.post('/interaction', { reaction_id: 0, activity_id })
        //let wasUnliked = response.data.wasUnliked //flag whether this is an unlike (true) or like (false)
        //dispatch({ type: 'react_to_activity', payload: { 'wasUnliked': wasUnliked, activity_id } })
        if (reactCallback) { reactCallback(); }
    } catch (err) {
        if (is_like) {
            dispatch({ type: 'preemptive_unlike', payload: { activity_id } })
        } else {
            dispatch({ type: 'preemptive_like', payload: { activity_id } })
        }
        console.log(err)
    }
}

const clearReactionContext = dispatch => async () => {
    try {
        dispatch({ type: 'clear_context' })
    } catch (err) {
    }
}


export const { Provider, Context } = createDataContext(
    reactionReducer,
    {
        fetchUserReactions, reactToActivity, fetchLikersOfActivity, clearReactionContext,
        fetchSessions, fetchSessionsNextBatch
    },
    {
        userSessions: [],
        userReaction: [],
        userNotifications: [],
    }
);
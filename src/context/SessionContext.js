import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';
import {
    compareAsc, eachDayOfInterval, format, subDays, addDays,
    endOfDay, startOfDay, parseISO, startOfMonth, endOfMonth
} from 'date-fns';
import { call } from 'react-native-reanimated';

const sessionReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_sessions':
            return { ...state, userSessions: action.payload }
        case 'fetch_sessions_batch':
            return { ...state, userSessions: [...state.userSessions, ...action.payload] }
        case 'fetch_self_sessions':
            return { ...state, selfOnlySessions: action.payload }
        case 'fetch_self_sessions_batch':
            return { ...state, selfOnlySessions: [...state.selfOnlySessions, ...action.payload] }
        case 'fetch_monthly':
            return { ...state, monthSessions: action.payload.monthlyData }//, calendarDate: action.payload.startOfMonth }
        case 'reset_calendar_date':
            return { ...state, calendarDate: action.payload }
        case 'fetch_reaction':
            return { ...state, userReaction: action.payload }
        case 'fetch_notification':
            return { ...state, userNotifications: action.payload }
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
        case 'delete_session':
            return {
                ...state,
                userSessions: state.userSessions.filter((req) => req.activity_id != action.payload.sessionId),
                monthSessions: state.monthSessions.filter((req) => req.activity_id != action.payload.sessionId),
            }
        case 'patch_session':
            return {
                ...state, userSessions: state.userSessions.map(item => {
                    if (item.activity_id == action.payload.sessionId) {
                        return { ...item, notes: action.payload.notes }
                    }
                    return item;
                }),
                monthSessions: state.monthSessions.map(item => {
                    if (item.activity_id == action.payload.sessionId) {
                        return { ...item, notes: action.payload.notes }
                    }
                    return item;
                }),
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
                daySessions: [],
                monthSessions: [],
                calendarDate: new Date(),
                selfOnlySessions: [],
            }
        default:
            return state;
    }
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

const fetchSessionsNextBatchSelf = dispatch => async (startIndex = 0, id) => {
    const response = await timeoutApi.get('/session', { params: { startIndex, friends: [], id } })
    dispatch({ type: 'fetch_self_sessions_batch', payload: response.data })
    return response.data
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

const fetchSessionsSelf = dispatch => async (id) => {
    const response = await timeoutApi.get('/session', { params: { id } })
    dispatch({ type: 'fetch_self_sessions', payload: response.data })

    return response.data
}

const fetchAvatars = dispatch => async (friendId) => {
    console.log("fetching friend avatars")
    try {
        console.log(friendId)
        const response = await timeoutApi.get('/avatar', { params: { friend: friendId } })

        //var base64Icon = `data:image/png;base64,${response.data}`
        //dispatch({ type: 'fetch_avatar', payload: base64Icon })
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Must be signed in!' })
    }
}


// fetch all tasks in the given day
const fetchMonthly = dispatch => async (date, callback = null) => {
    //let date = parseISO(dayObject.dateString)
    let startOfMonthTemp = startOfMonth(date)
    try {
        let startRange = startOfMonth(date)
        let endRange = endOfMonth(date)

        const response = await timeoutApi.get('/monthSessions', { params: { startTime: startRange, endTime: endRange } })
        dispatch({
            type: 'fetch_monthly', payload: {
                monthlyData: response.data,
                startOfMonth: format(startOfMonthTemp, 'yyyy-MM-dd')
            }
        })
        if (callback) { callback(response.data) }
    } catch (err) {
        console.log("Problem getting month's sessions", err)
    }
}

const resetCalendarDate = dispatch => async (reset_dt) => {
    console.log("Resetting calendar date to", reset_dt)
    dispatch({
        type: 'reset_calendar_date', payload: reset_dt
    })
}

const postSession = dispatch => async () => { };

const fetchFriendSession = dispatch => async () => {
};

const fetchOwnSession = dispatch => async () => { };

const patchSession = dispatch => async (sessionId, notes, callback = null, errorCallback = null) => {
    try {
        console.log("Sending over notes:", notes)
        const response = await timeoutApi.patch(`/session/${sessionId}`, { sessionId, notes })
        dispatch({ type: 'patch_session', payload: { sessionId, notes } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error patching session:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem patching the session.' })
        alert("There was a problem updating the task. Please check your internet connection")
        if (errorCallback) { errorCallback() }
    }
}

const deleteSession = dispatch => async (sessionId, callback = null, errorCallback = null) => {
    try {
        const response = await timeoutApi.delete(`/session/${sessionId}`, { params: { sessionId } })
        dispatch({ type: 'delete_session', payload: { sessionId } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error deleting session:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem deleting the session.' })
        alert("There was a problem deleting session. Please check your internet connection")
        if (errorCallback) { errorCallback() }
    }
}

const fetchAllSession = dispatch => async () => { };

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

const fetchNotifications = dispatch => async () => {
    try {
        const response = await timeoutApi.get('/notifications')
        console.log("Notifications: ", response.data)
        dispatch({ type: 'fetch_notification', payload: response.data })
    } catch (err) {
        console.log("problem fetching user notifications", err);
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

const clearSessionContext = dispatch => async () => {
    try {
        dispatch({ type: 'clear_context' })
    } catch (err) {

    }
}


export const { Provider, Context } = createDataContext(
    sessionReducer,
    {
        fetchSessions, fetchMonthly, fetchUserReactions, reactToActivity, fetchSessionsNextBatch,
        fetchSessionsSelf, fetchSessionsNextBatchSelf, fetchAvatars,
        resetCalendarDate, deleteSession, fetchNotifications, clearSessionContext, patchSession,
        fetchLikersOfActivity
    },
    {
        userSessions: [],
        userReaction: [],
        userNotifications: [],
        daySessions: [],
        monthSessions: [],
        calendarDate: new Date(),
        selfOnlySessions: [],
    }
);
import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sessionReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_sessions':
            return { ...state, userSessions: [...state.userSessions, ...action.payload] }
        case 'fetch_sessions_batch':
            return { ...state, userSessions: [...state.userSessions, ...action.payload] }
        case 'fetch_self_sessions':
            return { ...state, selfOnlySessions: action.payload }
        case 'fetch_self_sessions_batch':
            return { ...state, selfOnlySessions: [...state.selfOnlySessions, ...action.payload] }
        case 'fetch_monthly':
            return { ...state, monthSessions: action.payload.monthlyData }//, calendarDate: action.payload.startOfMonth }
        case 'fetch_multiple_months':
            return {
                ...state,
                batchDataForSummary: { ...state.batchDataForSummary, ...action.payload.batchDataForSummary },
                batchData: { ...state.batchData, ...action.payload.batchData },
                batchDataStart: action.payload.batchDataStart,
                batchDataEnd: action.payload.batchDataEnd,
            }
        case 'fetch_multiple_months_reset_all':
            return {
                ...state,
                batchDataForSummary: action.payload.batchDataForSummary,
                batchData: action.payload.batchData,
                batchDataStart: action.payload.batchDataStart,
                batchDataEnd: action.payload.batchDataEnd,
            }
        case 'reset_calendar_date':
            return { ...state, calendarDate: action.payload }
        case 'reset_current_date':
            return { ...state, mostCurrentDate: action.payload }
        case 'set_offset_fetched':
            return { ...state, offsetFetched: action.payload }
        case 'set_cur_offset':
            return { ...state, curOffset: action.payload }
        case 'set_hard_reset':
            return { ...state, needHardReset: action.payload }
        case 'fetch_reaction':
            return { ...state, userReaction: action.payload }
        case 'fetch_notification':
            return { ...state, userNotifications: action.payload }
        case 'fetch_notification_add_on':
            return { ...state, userNotifications: [...state.userNotifications, ...action.payload] }
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
                        return { ...item, notes: action.payload.notes, is_private: action.payload.isPrivate }
                    }
                    return item;
                }),
                monthSessions: state.monthSessions.map(item => {
                    if (item.activity_id == action.payload.sessionId) {
                        return { ...item, notes: action.payload.notes, is_private: action.payload.isPrivate }
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
        case 'save_session':
            var updatedBatchData = state.batchData;
            var monthKey = action.payload.monthKey
            var dayKey = action.payload.dayKey
            var sessionObjFinal = action.payload.sessionObjFinal
            if (typeof (state.batchData[monthKey]) === 'undefined') { // this is first session of the month
                console.log("Updating new month")
                updatedBatchData[monthKey] = [[dayKey, [sessionObjFinal]]]
            } else if (state.batchData[monthKey][0].length > 1 && state.batchData[monthKey][0][0] != dayKey) { // this is first session of day
                console.log("Updating new day")
                updatedBatchData[monthKey].unshift([dayKey, [sessionObjFinal]])
            } else { // not the first session of the day
                console.log("Adding on to day")
                updatedBatchData[monthKey][0][1].push(sessionObjFinal)
            }

            console.log("UPDATED BATCH DATA ", updatedBatchData)
            return {
                ...state,
                batchData: updatedBatchData
            }
        case 'clear_context':
            return {
                userSessions: [],
                userReaction: [],
                userNotifications: [],
                monthSessions: [],
                batchData: {},
                batchDataForSummary: {},
                calendarDate: new Date(),
                mostCurrentDate: new Date(),
                needHardReset: false, // set to true if any counters updated
                offsetFetched: 0,
                curOffset: 0,
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

const fetchSessions = dispatch => async (friends, startIndex, numToRetrieve) => {
    // clean up friends array
    var friendsArr = []
    for (var i in friends) {
        friendsArr.push(friends[i]['friend'])
    }

    console.log(`Requesting with startIndex ${startIndex} and numToRetrieve ${numToRetrieve}`)

    const response = await timeoutApi.get('/sessionFeed', { params: { friends: friendsArr, startIndex: startIndex, numToRetrieve: numToRetrieve } })
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

const byMonthKey = (dt, parse = true) => {
    if (parse) {
        return format(parseISO(dt), 'M/yyyy', { locale: enUS }).toString()
    }
    return format(dt, 'M/yyyy', { locale: enUS }).toString()

}

const byDayKey = (dt, parse = true) => {
    if (parse) {
        var actual_date = format(parseISO(dt), 'M/dd/yyyy', { locale: enUS })
        var actual_parts = actual_date.split('/')
        var yr = actual_parts[2]
        var month = actual_parts[0]
        var day = actual_parts[1]

        return month + "/" + day + "/" + yr
    } else {
        var actual_date = format(dt, 'M/dd/yyyy', { locale: enUS })
        var actual_parts = actual_date.split('/')
        var yr = actual_parts[2]
        var month = actual_parts[0]
        var day = actual_parts[1]

        return month + "/" + day + "/" + yr
    }

}

// key is month only, for summary
const groupMonthlyTasksForSummary = (monthSessions) => {
    var overallMap = {}
    for (var i = 0; i < monthSessions.length; i++) {
        var session = monthSessions[i]
        if (session.entry_type == 1) {
            var actual_parts = session.date_key.split('/')
            var yr = actual_parts[2]
            var month = actual_parts[0]
            var day = actual_parts[1]
            var monthKey = month + "/" + yr
        } else {
            var monthKey = byMonthKey(session.time_start)
        }
        if (monthKey in overallMap) {
            overallMap[monthKey].push(session)
        } else {
            overallMap[monthKey] = [session]
        }
    }
    return overallMap //Object.entries(overallMap)
}

// key is month as well as day, for detail
const groupMonthlyTasks = (monthSessions) => {
    var overallMap = {}
    for (var i = 0; i < monthSessions.length; i++) {
        var session = monthSessions[i]
        if (session.entry_type == 1) { // if counter type
            var dayKey = session.date_key

            var actual_parts = session.date_key.split('/')
            var yr = actual_parts[2]
            var month = actual_parts[0]
            var day = actual_parts[1]
            var monthKey = month + "/" + yr
        } else { // if activity type
            var dayKey = byDayKey(session.time_start)
            var monthKey = byMonthKey(session.time_start)
        }

        if (monthKey in overallMap) {
            if (dayKey in overallMap[monthKey]) {
                overallMap[monthKey][dayKey].push(session)
            } else {
                overallMap[monthKey][dayKey] = [session]
            }
        } else {
            overallMap[monthKey] = {}
            overallMap[monthKey][dayKey] = [session]
        }
    }
    var intermediateMap = {}
    for (const [key, value] of Object.entries(overallMap)) {
        intermediateMap[key] = {}
        for (var i in Object.entries(value)) {
            // sort this: Object.entries(value)[i][1]
            Object.entries(value)[i][1].sort((a, b) => {
                if (a.entry_type == 1 && b.entry_type == 1) { // do alphabetical
                    if (a.activity_name <= b.activity_name) {
                        return -1
                    } return 1
                }
                else if (a.entry_type == 1) {
                    return -1
                }
                return 1
            })
        }
        var dayKeyArray = Object.keys(overallMap[key]).sort().reverse()
        for (var key_ in dayKeyArray) {
            intermediateMap[key][dayKeyArray[key_]] = overallMap[key][dayKeyArray[key_]]
        }
    }
    // map to existing format that works
    var finalMap = {}
    for (var K in intermediateMap) {
        finalMap[K] = Object.keys(intermediateMap[K]).map((key) => [key, intermediateMap[K][key]])
    }
    //console.log("fINAL MAP ", finalMap)
    return finalMap
}

const fetchMultipleMonths = dispatch => async (startTime, endTime, callback = null, resetAll = false) => {
    console.log(`Fetching sessions between ${startTime} and ${endTime}`)
    try {

        /* TEMPORARY */
        const results = await timeoutApi.get('/testSessionsAndCounters', { params: { startTime: startTime, endTime: endTime } })
        //console.log("RESULTS ARE : ", results.data)

        // need to do the mapping client-side due to time zone issues
        let groupedData = groupMonthlyTasks(results.data)
        let groupedDataForSummary = groupMonthlyTasksForSummary(results.data);
        if (resetAll) {
            dispatch({
                type: 'fetch_multiple_months_reset_all', payload: {
                    //batchDataForSummary: results.data.groupedDataForSummary,
                    //batchData: results.data.groupedData,
                    batchDataForSummary: groupedDataForSummary,
                    batchData: groupedData,
                    batchDataStart: format(startTime, 'yyyy-MM-dd'),
                    batchDataEnd: format(endTime, 'yyyy-MM-dd'),
                }
            })
        } else {
            dispatch({
                type: 'fetch_multiple_months', payload: {
                    //batchDataForSummary: results.data.groupedDataForSummary,
                    //batchData: results.data.groupedData,
                    batchDataForSummary: groupedDataForSummary,
                    batchData: groupedData,
                    batchDataStart: format(startTime, 'yyyy-MM-dd'),
                    batchDataEnd: format(endTime, 'yyyy-MM-dd'),
                }
            })
        }

        if (callback) { callback(response.data) }
    } catch (err) {
        console.log("Problem getting multiple month sessions", err)
        console.log(err.stack)
    }
}

const saveSession = dispatch => async (sessionObjFinal, callback = null, errorCallback = null, fromCache) => {
    try {
        if (Array.isArray(sessionObjFinal)) {
            var toSend = sessionObjFinal
            console.log("SENDING ", toSend)
        } else {
            var toSend = [sessionObjFinal]
            console.log("SENDING ", toSend)
        }
        const response = await timeoutApi.post('/save_session', toSend)
        console.log("Session save successful!")
        console.log("Response is ", response.data);

        // put into batchData and batchDataForSummary

        //state.batchData["1/2023"] example [["1/23/2023",[]], ["1/22/2023",[]], ...]
        //state.batchData["1/2023"][0] example [ "1/23/2023", [{session},{session},{session}] ]
        //state.batchData["1/2023"][0][0] example: 1/23/2023
        // state.batchData["1/2023"][0][1] example: [{session},{session},{session}]


        /*var dayKey = byDayKey(sessionObjFinal.sessionStartTime, parse = false);
        var monthKey = byMonthKey(sessionObjFinal.sessionStartTime, parse = false);

        dispatch({
            type: 'save_session', payload: {
                monthKey: monthKey,
                dayKey: dayKey,
                sessionObjFinal: sessionObjFinal,
            }
        })*/


        if (callback) { callback() };
    } catch (err) {
        console.log("Problem adding session", err)

        // save session to asyncStorage to enter later
        if (!fromCache) {
            var storedSessions = await AsyncStorage.getItem('storedSessions')
            if (storedSessions) {
                var temp = JSON.parse(storedSessions)
                temp.push(sessionObjFinal)
                storedSessions = JSON.stringify(temp)
            } else {
                storedSessions = JSON.stringify([sessionObjFinal])
            }
            await AsyncStorage.setItem('storedSessions', storedSessions);
            alert("Sorry, we ran into a problem - your session will be saved when internet connection is stored")
        }
        if (errorCallback) { errorCallback() };
    }
}



// phase out using this one
const fetchMonthly = dispatch => async (date, callback = null) => {
    //let date = parseISO(dayObject.dateString)
    let startOfMonthTemp = startOfMonth(date)
    try {
        let startRange = startOfMonth(date)
        let endRange = endOfMonth(date)

        const response = await timeoutApi.get('/monthSessions', { params: { startTime: startRange, endTime: endRange } })
        dispatch({
            type: 'fetch_monthly', payload: {
                x: response.data,
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
const resetMostCurrentDate = dispatch => async (reset_dt) => {
    console.log("Resetting current date to", reset_dt)
    dispatch({
        type: 'reset_current_date', payload: reset_dt
    })
}

const setOffsetFetched = dispatch => async (num) => {
    dispatch({
        type: 'set_offset_fetched', payload: num
    })
}
const setCurOffset = dispatch => async (num) => {
    dispatch({
        type: 'set_cur_offset', payload: num
    })
}
const setHardReset = dispatch => async (bool_) => {
    console.log("Setting hard reset to ", bool_)
    dispatch({
        type: 'set_hard_reset', payload: bool_
    })
}

const patchSession = dispatch => async (sessionId, notes, isPrivate, callback = null, errorCallback = null) => {
    try {
        const response = await timeoutApi.patch(`/session/${sessionId}`, { sessionId, notes, isPrivate })
        dispatch({ type: 'patch_session', payload: { sessionId, notes, isPrivate } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error patching session:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem patching the session.' })
        alert("There was a problem updating the task. Please check your internet connection")
        if (errorCallback) { errorCallback() }
    }
}

const deleteSession = dispatch => async (sessionObj, callback = null, errorCallback = null) => {
    var dt = sessionObj.time_start

    console.log("Deleting session with id ", sessionObj.activity_id)

    try {
        const response = await timeoutApi.delete(`/session/${sessionObj.activity_id}`,
            { params: { sessionId: sessionObj.activity_id } })
        dispatch({ type: 'delete_session', payload: { sessionId: sessionObj.activity_id } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error deleting session:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem deleting the session.' })
        alert("There was a problem deleting session. Please check your internet connection")
        if (errorCallback) { errorCallback() }
    }
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

const fetchNotifications = dispatch => async () => {
    try {
        const response = await timeoutApi.get('/notifications')
        console.log("Notifications: ", response.data)
        dispatch({ type: 'fetch_notification', payload: response.data })
    } catch (err) {
        console.log("problem fetching user notifications", err);
    }
}

const fetchNotificationsBatch = dispatch => async (startIndex, initialNumToRetrieve, isInitial = false, callback = null, errorCallback = null) => {
    try {
        const response = await timeoutApi.get(`/notifications`,
            { params: { startIndex: startIndex, numToRetrieve: initialNumToRetrieve, } })
        if (isInitial) {
            dispatch({ type: 'fetch_notification', payload: response.data })
        } else {
            dispatch({ type: 'fetch_notification_add_on', payload: response.data })
        }
        return response.data

    } catch (err) {
        console.log("problem fetching user notifications batch", err);
        if (errorCallback) { errorCallback() }
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
        fetchLikersOfActivity, fetchMultipleMonths, saveSession, setOffsetFetched, setCurOffset,
        setHardReset, resetMostCurrentDate, fetchNotificationsBatch,
    },
    {
        userSessions: [],
        userReaction: [],
        userNotifications: [],
        monthSessions: [],
        batchData: {},
        batchDataForSummary: {},
        calendarDate: new Date(),
        mostCurrentDate: new Date(),
        needHardReset: false, // set to true if any counters updated
        offsetFetched: 0,
        curOffset: 0,
        selfOnlySessions: [],
    }
);
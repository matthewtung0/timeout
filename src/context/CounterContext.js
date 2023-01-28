import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';
import { format, parseISO, startOfMonth, endOfMonth, startOfDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

const counterReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_counters':
            return { ...state, userCounters: action.payload }
        case 'add_counter':
            return state
        case 'add_tally':
            return {
                ...state,
                userCounters: state.userCounters.map(item => {
                    if (item.counter_id == action.payload.counterId) {
                        return {
                            ...item, cur_count: parseInt(item.cur_count) +
                                parseInt(action.payload.updateAmount),
                            point_count: parseInt(item.point_count) + parseInt(action.payload.updateAmount)
                        }
                    }
                    return item;
                })
            }
        case 'reset_tally':
            return {
                ...state,
                userCounters: state.userCounters.map(item => {
                    if (item.counter_id == action.payload.counterId) {
                        return { ...item, cur_count: 0 }
                    }
                    return item;
                })
            }
        case 'delete_counter':
            return {
                ...state,
                userCounters: state.userCounters.filter((req) => req.counter_id != action.payload.counterId)
            }

        case 'change_color':
            return {
                ...state, userCounters: state.userCounters.map(item => {
                    if (item.counter_id == action.payload.counter_id) {
                        return { ...item, color_id: action.payload.colorId }
                    }
                    return item
                })
            }
        case 'archive_counter':
            return {
                ...state, userCounters: state.userCounters.map(item => {
                    if (item.counter_id == action.payload.counter_id) {
                        return { ...item, archived: action.payload.archived }
                    }
                    return item
                })
            }
        case 'fetch_multiple_months':
            return {
                ...state,
                //batchDataForSummary: { ...state.batchDataForSummary, ...action.payload.batchDataForSummary },
                batchData: { ...state.batchData, ...action.payload.batchData },
                batchDataStart: action.payload.batchDataStart,
                batchDataEnd: action.payload.batchDataEnd,
            }
        case 'counter_table_locked':
            return {
                ...state,
                counterTablesLocked: action.payload,
            }
        default:
            return state;
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
// key is month as well as day, for detail
const groupMonthlyCounters = (countersByDay) => {
    var overallMap = {}
    for (var i = 0; i < countersByDay.length; i++) {
        var session = countersByDay[i]
        var dayKey = byDayKey(session.time_start)
        var monthKey = byMonthKey(session.time_start)

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
    for (const [key, value] of Object.entries(overallMap)) {
        Object.entries(value).sort((a, b) => { return a })
    }

    // map to existing format that works
    var finalMap = {}
    for (var K in overallMap) {
        finalMap[K] = Object.keys(overallMap[K]).map((key) => [key, overallMap[K][key]])
    }
    return finalMap
}

const fetchMultipleMonthsCounters = dispatch => async (startTime, endTime, callback = null, resetAll = false) => {
    console.log(`Fetching counters between ${startTime} and ${endTime}`)
    try {
        const response = await timeoutApi.get('/counter/month', { params: { startTime: startTime, endTime: endTime } })
        console.log("RAW COUNTER DATA: ", response.data)

        var groupedCounters = groupMonthlyCounters(response.data);
        console.log("GROUPED COUNTERS: ", groupedCounters);

        dispatch({
            type: 'fetch_multiple_months', payload: {
                //batchDataForSummary: groupedTasksForSummary,
                batchData: groupedCounters,
                batchDataStart: format(startTime, 'yyyy-MM-dd'),
                batchDataEnd: format(endTime, 'yyyy-MM-dd'),
            }
        })
        if (callback) { callback(response.data) }
        /*var groupedTasksForSummary = groupMonthlyTasksForSummary(response.data);
        if (resetAll) {
            dispatch({
                type: 'fetch_multiple_months_reset_all', payload: {
                    batchDataForSummary: groupedTasksForSummary,
                    batchData: groupedTasks,
                    batchDataStart: format(startTime, 'yyyy-MM-dd'),
                    batchDataEnd: format(endTime, 'yyyy-MM-dd'),
                }
            })
        } else {
            dispatch({
                type: 'fetch_multiple_months', payload: {
                    batchDataForSummary: groupedTasksForSummary,
                    batchData: groupedTasks,
                    batchDataStart: format(startTime, 'yyyy-MM-dd'),
                    batchDataEnd: format(endTime, 'yyyy-MM-dd'),
                }
            })
        }
        if (callback) { callback(response.data) }*/
    } catch (err) {
        console.log("Problem getting multiple month sessions", err)
    }
}

const fetchUserCounters = dispatch => async (id) => {
    console.log("trying to fetch user counters");
    try {
        var startDate = startOfDay(new Date())
        const response = await timeoutApi.get('/counter', { params: { id, startDate } })
        dispatch({ type: 'fetch_counters', payload: response.data })
    } catch (err) {
        console.log("error fetching counters", err);
        dispatch({ type: 'add_error', payload: 'There was a problem retrieving the counters.' })
    }
}

const addCounter = dispatch => async (counterName, timeSubmitted, chosenColor, isPublic, callback = null) => {
    console.log("trying to add counter");
    try {
        const response = await timeoutApi.post('/counter', { counterName, timeSubmitted, chosenColor, isPublic })
        dispatch({ type: 'add_counter', payload: { counterName, timeSubmitted, chosenColor, isPublic } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error adding counter:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem adding the counter.' })
    }
}

const deleteCounter = dispatch => async (counterId, callback = null) => {
    console.log("trying to delete counter");
    try {
        const response = await timeoutApi.delete(`/counter/${counterId}`)
        dispatch({ type: 'delete_counter', payload: { counterId } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error deleting counter:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem deleting the counter.' })
    }
}

const addTally = dispatch => async (counterId, updateAmount, callback = null) => {
    try {
        var tally_time = startOfDay(new Date())
        const response = await timeoutApi.post('/counter/tally', { counterId, updateAmount, tally_time })
        dispatch({ type: 'add_tally', payload: { counterId, updateAmount } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error adding tally to counter:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem adding the tally to counter.' })
    }
}

const resetTally = dispatch => async (counterId, callback = null) => {
    try {
        const response = await timeoutApi.post('/counter/reset', { counterId })
        dispatch({ type: 'reset_tally', payload: { counterId } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error resetting counter:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem resetting counter.' })
    }
}

const changeColorCounter = dispatch => async (counterId, newColorId, callback = null) => {
    try {
        const response = await timeoutApi.patch(`/counter/${counterId}`, { colorId: newColorId })
        dispatch({ type: 'change_color', payload: { counterId, colorId: newColorId } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error changing color id:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem changing the color.' })
    }
}

const changeArchiveCounter = dispatch => async (counterId, toArchive, callback = null) => {
    try {
        const response = await timeoutApi.patch(`/counter/${counterId}`, { categoryId, archived: toArchive })
        dispatch({ type: 'archive_counter', payload: { counterId, archived: toArchive } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error changing archive status:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem toggling the archive status.' })
    }
}

const setCounterTablesLocked = dispatch => async (bool_) => {
    console.log("Setting counter table locked to ", bool_)
    dispatch({ type: 'counter_table_locked', payload: bool_ })
    return 'done'
}

export const { Provider, Context } = createDataContext(
    counterReducer,
    {
        fetchUserCounters, addCounter, addTally, resetTally, deleteCounter,
        changeColorCounter, changeArchiveCounter, fetchMultipleMonthsCounters,
        setCounterTablesLocked,
    },
    {
        userCounters: [],
        batchData: {},
        counterTablesLocked: false,
    }
);
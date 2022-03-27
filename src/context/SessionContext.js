import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';
import {
    compareAsc, eachDayOfInterval, format, subDays, addDays,
    endOfDay, startOfDay, parseISO, startOfMonth, endOfMonth
} from 'date-fns';

const sessionReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_sessions':
            return { ...state, userSessions: action.payload }
        case 'fetch_monthly':
            return { ...state, monthSessions: action.payload.monthlyData, calendarDate: action.payload.startOfMonth }
        default:
            return state;
    }
}

const fetchSessions = dispatch => async () => {
    const response = await timeoutApi.get('/sessions')
    dispatch({ type: 'fetch_sessions', payload: response.data })
}

const fetchMonthly = dispatch => async (dayObject) => {
    //let date = parseISO(JSON.parse(dayObject).dateString)
    let date = parseISO(dayObject.dateString)
    let startOfMonthTemp = startOfMonth(parseISO(dayObject.dateString))
    try {
        let startRange = startOfMonth(date)
        let endRange = endOfMonth(date)
        console.log("Start range is", startRange)

        const response = await timeoutApi.get('/monthSessions', { params: { startTime: startRange, endTime: endRange } })
        dispatch({
            type: 'fetch_monthly', payload: {
                monthlyData: response.data,
                startOfMonth: format(startOfMonthTemp, 'yyyy-MM-dd')
            }
        })
        //return response.data
    } catch (err) {
        console.log("Problem getting month's sessions", err)
    }
}

const postSession = dispatch => async () => { };

const fetchFriendSession = dispatch => async () => { };

const fetchOwnSession = dispatch => async () => { };

const DeleteSession = dispatch => async () => { };

const fetchAllSession = dispatch => async () => { };


export const { Provider, Context } = createDataContext(
    sessionReducer,
    { fetchSessions, fetchMonthly },
    {
        userSessions: [],
        daySessions: [],
        monthSessions: [],
        calendarDate: '',
    }
);
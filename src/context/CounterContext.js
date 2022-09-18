import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';

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
        default:
            return state;
    }
}

const fetchUserCounters = dispatch => async (id) => {
    console.log("trying to fetch user counters");
    try {
        const response = await timeoutApi.get('/counter', { params: { id } })
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

const addTally = dispatch => async (counterId, updateAmount, callback = null) => {
    try {
        const response = await timeoutApi.post('/counter/tally', { counterId, updateAmount })
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

export const { Provider, Context } = createDataContext(
    counterReducer,
    {
        fetchUserCounters, addCounter, addTally, resetTally
    },
    {
        userCounters: [],
    }
);
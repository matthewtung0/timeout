import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';

const categoryReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_categories':
            console.log("returning payload,", action.payload);
            return { ...state, userCategories: action.payload }
        case 'set_chosen_category':
            return {
                ...state, chosenCategory: action.payload.buttonName, chosenCatId: action.payload.buttonId,
                inSession: true
            }
        case 'set_activity_name':
            return { ...state, customActivity: action.payload }
        case 'set_start_time':
            return { ...state, sessionStartTime: action.payload }
        case 'set_prod_rating':
            return { ...state, prodRating: action.payload }
        case 'set_end_time':
            return { ...state, sessionEndTime: action.payload.endTime, endEarlyFlag: action.payload.endEarlyFlag }
        case 'add_error':
            return { errorMessage: '', errorMessage: action.payload };
        default:
            return state;
    }
}

const setStartTime = dispatch => (startTime) => {
    console.log("setting start time to ", startTime);
    try {
        dispatch({ type: 'set_start_time', payload: startTime })
    } catch (err) {
        console.log("error setting start time")
    }
}

const setActivityName = dispatch => (activityName) => {
    console.log("setting activity name to ", activityName);
    try {
        dispatch({ type: 'set_activity_name', payload: activityName })
    } catch (err) {
        console.log("error setting custom activity name")
    }
}

const setProdRating = dispatch => (prodRating) => {
    console.log("setting prod rating to ", prodRating);
    try {
        dispatch({ type: 'set_prod_rating', payload: prodRating })
    } catch (err) {
        console.log("error setting prod rating")
    }
}

const setEndTime = dispatch => (endTime, endEarlyFlag) => {
    console.log("setting end activity time");
    try {
        dispatch({ type: 'set_end_time', payload: { endTime, endEarlyFlag } })
    } catch (err) {
        console.log("error setting end time")
    }
}

const setChosen = dispatch => (button) => {
    console.log("setting chosen category to" + button);
    try {
        dispatch({ type: 'set_chosen_category', payload: button })
    } catch (err) {
        console.log("error setting chosen category in category context");
    }
}

const fetchUserCategories = dispatch => async () => {
    console.log("TRYING TO FETCH CATEGORIES???");
    try {
        const response = await timeoutApi.get('/categories')
        console.log(response.data);
        dispatch({ type: 'fetch_categories', payload: response.data })
    } catch (err) {
        console.log("ERRRORRRR", err);
        dispatch({ type: 'add_error', payload: 'There was a problem retrieving the categories.' })
    }
}


export const { Provider, Context } = createDataContext(
    categoryReducer,
    { fetchUserCategories, setChosen, setActivityName, setStartTime, setEndTime, setProdRating },
    {
        userCategories: [], chosenCategory: '',
        chosenCatId: 0,
        inSession: false,
        errorMessage: '',
        customActivity: '',
        sessionStartTime: 0,
        sessionEndTime: 0,
        endEarlyFlag: false,
        prodRating: 50,
    }
);
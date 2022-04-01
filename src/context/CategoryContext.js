import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';

const categoryReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_categories':
            return { ...state, userCategories: action.payload }
        case 'fetch_todo_items':
            return { ...state, userTodoItems: action.payload }
        case 'add_todo_item':
            // dont try manually appending this.. wait for the repull
            return state
        //return { ...state, userTodoItems: [...state.userTodoItems, action.payload] }
        case 'add_category':
            // dont try manually appending this .. wait for the repull
            return state
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
            return { ...state, errorMessage: action.payload };

        case 'delete_todo_item':
            return {
                ...state,
                userTodoItems: state.userTodoItems.filter((req) => req.item_id != action.payload.toDoId)
            }
        case 'delete_category':
            return {
                ...state,
                userCategories: state.userCategories.filter((req) => req.category_id != action.payload.categoryId)
            }
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
    console.log("trying to fetch user categories");
    try {
        const response = await timeoutApi.get('/category')
        dispatch({ type: 'fetch_categories', payload: response.data })
    } catch (err) {
        console.log("ERRRORRRR FETCHING CATEGORIES", err);
        dispatch({ type: 'add_error', payload: 'There was a problem retrieving the categories.' })
    }
}

// putting todo items in this context for now..
const fetchUserTodoItems = dispatch => async () => {
    console.log("trying to fetch todo items");
    try {
        const response = await timeoutApi.get('/todoItem')
        dispatch({ type: 'fetch_todo_items', payload: response.data })
    } catch (err) {
        console.log("error fetching todo items:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem retrieving the todo items.' })
    }
}

const addTodoItem = dispatch => async (toDoItemName, timeSubmitted, categoryId, callback = null) => {
    console.log("trying to add todo item");
    try {
        const response = await timeoutApi.post('/todoItem', { toDoItemName, timeSubmitted, categoryId })
        dispatch({ type: 'add_todo_item', payload: { toDoItemName, timeSubmitted, categoryId } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error adding todo item:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem adding the todo item.' })
    }
}

const deleteTodoItem = dispatch => async (toDoId, callback = null) => {
    try {
        const response = await timeoutApi.delete('/todoItem', { toDoId })
        dispatch({ type: 'delete_todo_item', payload: { toDoId } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error deleting todo item:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem deleting the todo item.' })
    }
}

const addCategory = dispatch => async (categoryName, timeSubmitted, callback = null) => {
    console.log("trying to add category");
    try {
        const response = await timeoutApi.post('/category', { categoryName, timeSubmitted })
        dispatch({ type: 'add_category', payload: { categoryName, timeSubmitted } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error adding category:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem adding the category.' })
    }
}

const deleteCategory = dispatch => async (categoryId, callback = null) => {
    console.log("trying to delete category");
    try {
        const response = await timeoutApi.delete('/category', { categoryId })
        dispatch({ type: 'delete_category', payload: { categoryId } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error deleting category:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem deleting the category.' })
    }
}


export const { Provider, Context } = createDataContext(
    categoryReducer,
    {
        fetchUserCategories, setChosen, setActivityName, setStartTime, setEndTime, setProdRating,
        fetchUserTodoItems, addTodoItem, addCategory, deleteTodoItem, deleteCategory
    },
    {
        userCategories: [],
        chosenCategory: 'unsorted',
        chosenCatId: 3,
        inSession: false,
        errorMessage: '',
        customActivity: '',
        sessionStartTime: 0,
        sessionEndTime: 0,
        endEarlyFlag: false,
        prodRating: 50,
        userTodoItems: [],
    }
);
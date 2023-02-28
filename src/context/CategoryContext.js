import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const default_categories = [
    {
        "archived": false,
        "category_id": "3",
        "category_name": "Unsorted",
        "color_id": "c6",
        "is_active": true,
        "public": true,
        "time_created": "2022-03-16T06:07:23.199Z",
        "user_id": "3",
    },
]

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
        case 'archive_category':
            return {
                ...state, userCategories: state.userCategories.map(item => {
                    if (item.category_id == action.payload.categoryId) {
                        return { ...item, archived: action.payload.archived }
                    }
                    return item
                })
            }
        case 'public_category':
            return {
                ...state, userCategories: state.userCategories.map(item => {
                    if (item.category_id == action.payload.categoryId) {
                        return { ...item, public: action.payload.isPublic }
                    }
                    return item
                })
            }
        case 'change_color':
            console.log("CHANGING THE COLOR")
            return {
                ...state, userCategories: state.userCategories.map(item => {
                    if (item.category_id == action.payload.categoryId) {
                        console.log("Changing ", item.category_id)
                        console.log("To", action.payload.colorId)
                        return { ...item, color_id: action.payload.colorId }
                    }
                    return item
                })
            }
        case 'edit_category':
            return {
                ...state, userCategories: state.userCategories.map(item => {
                    if (item.category_id == action.payload.categoryId) {
                        return {
                            ...item, color_id: action.payload.colorId,
                            archived: action.payload.archived,
                            //isPublic: action.payload.isPublic,
                            public: action.payload.isPublic,
                        }
                    }
                    return item
                })
            }
        case 'edit_todo_item_pin':
            return {
                ...state, userTodoItems: state.userTodoItems.map(item => {
                    if (item.item_id == action.payload.toDoId) {
                        return {
                            ...item,
                            is_pinned: action.payload.is_pinned,
                        }
                    }
                    return item
                })
            }
        case 'clear_context':
            return {
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

const fetchUserCategories = dispatch => async (id, getPrivate = true, isSelf = true) => {
    console.log("trying to fetch user categories with id ", id);
    try {
        const response = await timeoutApi.get(`/category/${id}`, { params: { getPrivate, isSelf } })
        dispatch({ type: 'fetch_categories', payload: response.data })

        // cache user's categories
        if (isSelf) {
            console.log("Trying to cache categories")
            const a = await AsyncStorage.setItem('categories', JSON.stringify(response.data));
        }
        console.log("fetchUserCategories complete")

    } catch (err) {
        console.log("error fetching categories, trying cache");

        try {
            var cached_categories = await AsyncStorage.getItem('categories');
            dispatch({ type: 'fetch_categories', payload: JSON.parse(cached_categories) })
        } catch (err) {
            dispatch({ type: 'add_error', payload: 'There was a problem retrieving the categories.' })
        }
    }
}

// putting todo items in this context for now..
const fetchUserTodoItems = dispatch => async (isSelf = true) => {
    try {
        const response = await timeoutApi.get('/todoItem')
        dispatch({ type: 'fetch_todo_items', payload: response.data })

        if (isSelf) {
            console.log("Tryign to cache todo items")
            await AsyncStorage.setItem('todo_items', JSON.stringify(response.data));
        }
        console.log("fetchUserTodoItems complete")
    } catch (err) {
        console.log("error fetching todo items:", err);
        try {
            var cached_todo_items = await AsyncStorage.getItem('todo_items');
            dispatch({ type: 'fetch_todo_items', payload: JSON.parse(cached_todo_items) })
        } catch (err) {
            dispatch({ type: 'add_error', payload: 'There was a problem retrieving the todo items.' })
        }
    }
}

const addTodoItem = dispatch => async (toDoItemName, timeSubmitted, categoryId, notes, callback = null, errorCallback = null) => {
    console.log("trying to add todo item");
    try {
        const response = await timeoutApi.post('/todoItem', { toDoItemName, timeSubmitted, categoryId, notes })
        dispatch({ type: 'add_todo_item', payload: { toDoItemName, timeSubmitted, categoryId, notes } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error adding todo item:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem adding the todo item.' })
        alert("There was a problem adding task to your list. Please check your internet connection")
        if (errorCallback) { errorCallback() }
    }
}

const editTodoItemPin = dispatch => async (toDoId, is_pinned, callback = null, errorCallback = null) => {
    try {
        const response = await timeoutApi.put('/todoItem/pin', { toDoId, is_pinned })
        dispatch({ type: 'edit_todo_item_pin', payload: { toDoId, is_pinned } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error editing todo item pin:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem editing the todo item.' })
        alert("There was a problem editing the task. Please try again later.")
        if (errorCallback) { errorCallback() }
    }
}


const editTodoItem = dispatch => async (toDoItemName, categoryId, notes, oldToDoName, callback = null, errorCallback = null) => {
    try {
        const response = await timeoutApi.put('/todoItem', { toDoItemName, categoryId, notes, oldToDoName })
        dispatch({ type: 'add_todo_item', payload: { toDoItemName, categoryId, notes, oldToDoName } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error editing todo item:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem editing the todo item.' })
        alert("There was a problem editing the task. Please try again later.")
        if (errorCallback) { errorCallback() }
    }
}

const deleteTodoItem = dispatch => async (toDoId, callback = null, errorCallback = null) => {
    try {
        const response = await timeoutApi.delete('/todoItem', { params: { toDoId } })
        dispatch({ type: 'delete_todo_item', payload: { toDoId } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error deleting todo item:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem deleting the todo item.' })
        alert("There was a problem deleting the task. Please try again later.")
        if (errorCallback) { errorCallback() }
    }
}

const addCategory = dispatch => async (categoryName, timeSubmitted, chosenColor, isPublic, callback = null, errorCallback = null) => {
    console.log("trying to add category");
    try {
        const response = await timeoutApi.post('/category/',
            { categoryName, timeSubmitted, chosenColor, isPublic })
        dispatch({ type: 'add_category', payload: { categoryName, timeSubmitted, chosenColor, isPublic } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error adding category:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem adding the category.' })
        alert("There was a problem adding new category. Please try again later.")
        if (errorCallback) { errorCallback() }
    }
}

const deleteCategory = dispatch => async (categoryId, callback = null, errorCallback = null) => {
    try {
        const response = await timeoutApi.delete(`/category/${categoryId}`, { params: { categoryId } })
        dispatch({ type: 'delete_category', payload: { categoryId } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error deleting category:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem deleting the category.' })
        alert("There was a problem deleting category. Please try again later.")
        if (errorCallback) { errorCallback() }
    }
}

const changePublicCategory = dispatch => async (categoryId, toPublic, callback = null, errorCallback = null) => {
    try {
        const response = await timeoutApi.patch(`/category/${categoryId}`, { categoryId, isPublic: toPublic })
        dispatch({ type: 'public_category', payload: { categoryId, isPublic: toPublic } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error changing public status:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem toggling the public status.' })
        alert("There was a problem updating category. Please try again later.")
        if (errorCallback) { errorCallback() }
    }

}

const changeArchiveCategory = dispatch => async (categoryId, toArchive, callback = null, errorCallback = null) => {
    console.log("trying to change archive category to ", toArchive);
    try {
        const response = await timeoutApi.patch(`/category/${categoryId}`, { categoryId, archived: toArchive })
        dispatch({ type: 'archive_category', payload: { categoryId, archived: toArchive } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error changing archive status:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem toggling the archive status.' })
        alert("There was a problem updating category. Please try again later.")
        if (errorCallback) { errorCallback() }
    }
}

const changeColorCategory = dispatch => async (categoryId, newColorId, callback = null, errorCallback = null) => {
    console.log("trying to change color");
    try {
        const response = await timeoutApi.patch(`/category/${categoryId}`, { colorId: newColorId })
        dispatch({ type: 'change_color', payload: { categoryId, colorId: newColorId } })
        if (callback) { callback() }
    } catch (err) {
        console.log("error changing color id:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem changing the color.' })
        alert("There was a problem updating category. Please try again later.")
        if (errorCallback) { errorCallback() }
    }
}

const editCategory = dispatch => async (categoryId, newColorId, toPublic, toArchive,
    callback = null, errorCallback = null) => {
    /*console.log("Category id ", categoryId)
    console.log("newColorId ", newColorId)
    console.log("toPublic ", toPublic)
    console.log("toArchive ", toArchive)*/
    try {
        const response = await timeoutApi.patch(`/category/${categoryId}`,
            { colorId: newColorId, archived: toArchive, isPublic: toPublic })
        dispatch({
            type: 'edit_category', payload: {
                categoryId,
                colorId: newColorId,
                archived: toArchive,
                isPublic: toPublic
            }
        })
        if (callback) { callback() }
    } catch (err) {
        console.log("error changing color id:", err);
        dispatch({ type: 'add_error', payload: 'There was a problem changing the color.' })
        alert("There was a problem updating category. Please try again later.")
        if (errorCallback) { errorCallback() }
    }
}

const clearCategoryContext = dispatch => async () => {
    try {
        dispatch({ type: 'clear_context' })
    } catch (err) {

    }
}


export const { Provider, Context } = createDataContext(
    categoryReducer,
    {
        fetchUserCategories, setChosen, setActivityName, setStartTime, setEndTime, setProdRating,
        fetchUserTodoItems, addTodoItem, addCategory, deleteTodoItem, deleteCategory, editTodoItem,
        changeArchiveCategory, changeColorCategory, clearCategoryContext, changePublicCategory,
        editCategory, editTodoItemPin,
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
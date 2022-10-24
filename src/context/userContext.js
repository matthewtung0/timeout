import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';

const userReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_self':
            return {
                ...state,
                firstName: action.payload.user_info.first_name,
                lastName: action.payload.user_info.last_name,
                username: action.payload.user_info.username,
                friendCode: action.payload.user_info.friend_code,
                points: action.payload.user_info.points,
                totalTime: action.payload.user_stats.total_time,
                totalTasks: action.payload.user_stats.num_tasks,
                avatarItems: action.payload.user_avatar.avatarItems,
                avatarColors: action.payload.user_avatar.avatarColors,
                hasItems: action.payload.user_avatar.hasItems,
                user_id: action.payload.user_info.user_id,

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
                //friends: [...state.friends, { userId: action.payload.idToAccept, username: action.payload.usernameToAccept }],
                errorMessage: ''
            }
        case 'reject_friend':
            return {
                ...state, incomingFriendReqs: state.incomingFriendReqs.filter((req) => req.friend_a != action.payload.idToReject),
                friends: state.friends.filter((req) => req.friend != action.payload.idToReject),
                outgoingFriendReqs: state.outgoingFriendReqs.filter((req) => req.friend_b != action.payload.idToReject),
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
            }
        case 'add_points':
            return { ...state, points: parseInt(state.points) + parseInt(action.payload.pointsToAdd) }
        case 'save_avatar':
            return {
                ...state, avatarColors: action.payload.colors, avatarItems: action.payload.items,
                hasItems: action.payload.hasItems,
                base64pfp: action.payload.avatarBase64Data
            }
        case 'clear_response':
            return { ...state, responseMessage: '', errorMessage: '' }
        case 'clear_context':
            return {
                outgoingFriendReqs: [],
                incomingFriendReqs: [],
                friends: [],
                user_id: '',
                errorMessage: '',
                firstName: '',
                lastName: '',
                username: '',
                friendCode: '',
                points: 0,
                responseMessage: '',
                totalTasks: 0,
                totalTime: 0,
                base64pfp: '',
                idToView: '', usernameToView: '',
            }
        case 'fetch_avatar':
            return { ...state, base64pfp: action.payload }
        case 'fetch_items_owned':
            return { ...state, avatarItemsOwned: action.payload }
        case 'set_id_to_view':
            return { ...state, idToView: action.payload.user_id, usernameToView: action.payload.username }
        default:
            return state;
    }
}

const fetchSelf = dispatch => async () => {
    try {
        const response = await timeoutApi.get(`/info/self`)
        console.log("setting self info to", response.data)
        dispatch({ type: 'fetch_self', payload: response.data })
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Must be signed in!' })
    }
}

const fetchAvatar = dispatch => async () => {
    console.log("fetching profile avatar")
    try {
        const response = await timeoutApi.get('/avatar1')
        console.log("response is ..... ", response)
        var base64Icon = `data:image/png;base64,${response.data}`
        //console.log(base64Icon)
        dispatch({ type: 'fetch_avatar', payload: base64Icon })
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Must be signed in!' })
    }
}

const fetchAvatarItemsOwned = dispatch => async () => {
    try {
        console.log("Fetching avatar items owned")
        const response = await timeoutApi.get('/user/owned')
        //console.log(base64Icon)
        dispatch({ type: 'fetch_items_owned', payload: response.data })
    } catch (err) {
        console.log(err)
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

const saveAvatar = dispatch => async (items, colors, hasItems, callback = null) => {
    try {
        const response = await timeoutApi.post('/self_user/avatar', { items, colors, hasItems })
        var avatarBase64Data = `data:image/png;base64,${response.data}`
        dispatch({ type: 'save_avatar', payload: { items, colors, hasItems, avatarBase64Data } })
        console.log("saving done")
        if (callback) { callback() }
    } catch (err) {
        console.log("Problem saving avatar:", err)
        dispatch({ type: 'add_error', payload: 'Problem saving avatar!' })
    }
}
const purchaseItems = dispatch => async (itemArr, callback = null) => {
    try {
        const response = await timeoutApi.post('/user/owned', { itemArr })
        dispatch({ type: 'fetch_items_owned', payload: response.data })
        console.log("done purchasing items")
        console.log("updated owned items...", response.data)
        if (callback) { callback() }
    } catch (err) {
        console.log("Problem purchasing items:", err)
        dispatch({ type: 'add_error', payload: 'Problem purchasing items!' })
    }
}



const fetchEveryone = dispatch => async () => { };

const postSelf = dispatch => async () => { }

const editSelf = dispatch => async (firstName, lastName, username, callback) => {
    try {
        const response = await timeoutApi.patch('/self_user', { firstName, lastName, username })
        dispatch({ type: 'edit_self', payload: { firstName, lastName, username } })
        callback()

    } catch (err) {
        console.log("Problem editing self user info:", err)
        dispatch({ type: 'add_error', payload: 'Problem updating info!' })
    }
}

const addPoints = dispatch => async (id, pointsToAdd, callback) => {
    try {
        const response = await timeoutApi.patch(`/points/${id}`, { pointsToAdd })
        dispatch({ type: 'add_points', payload: { pointsToAdd } })
        if (callback) { callback() }
    } catch (err) {
        console.log("Problem adding points:", err)
        dispatch({ type: 'add_error', payload: 'Problem adding points!' })
    }
}

/*const updateStats = dispatch => async (startTime, endTime) => {

}*/

const clearResponseMessage = dispatch => () => {
    dispatch({ type: 'clear_response', payload: {} })
}

const deleteSelf = dispatch => async () => { }

const editFriends = dispatch => async () => { }

const updateLastSignin = dispatch => async (callback = null) => {
    try {
        const response = await timeoutApi.patch('/self_user/lastsignin')
        console.log("updated last sign in")
        if (callback) { callback() }
    } catch (err) {
        console.log("can't update last sign in", err)
    }
}

const clearUserContext = dispatch => async () => {
    try {
        dispatch({ type: 'clear_context' })
    } catch (err) {

    }
}

const setIdToView = dispatch => async (obj) => {
    try {
        dispatch({ type: 'set_id_to_view', payload: obj })
        console.log("Successfully set", id)
    } catch (err) {

    }
}


export const { Provider, Context } = createDataContext(
    userReducer,
    {
        fetchSelf, requestFriend, fetchOutgoingRequests, fetchIncomingRequests,
        acceptFriendRequest, rejectFriendRequest, fetchFriends, editSelf,
        addPoints, clearResponseMessage, clearUserContext, fetchAvatar, updateLastSignin,
        saveAvatar, setIdToView, fetchAvatarItemsOwned, purchaseItems
    },
    {
        outgoingFriendReqs: [],
        incomingFriendReqs: [],
        friends: [],
        errorMessage: '',
        firstName: '',
        lastName: '',
        username: '',
        user_id: '',
        friendCode: '',
        points: 0,
        responseMessage: '',
        totalTasks: 0,
        totalTime: 0,
        base64pfp: '',
        avatarItems: {
            face: { mouth: 0, eyes: 0, makeup: 0, eyebrows: 0, base: 0, },
            accessories: { glasses: 1, piercings: 1, accessories: 0, hairAccessories: 0, },
            clothing: { outerwear: 1, top: 1, under: 0, },
            hair: { front: 1, back: 1, side: 1, general: 0, },
            background: 0, overlay: 0,
        },
        avatarColors: {
            face: { mouth: 0, eyes: 0, makeup: 0, eyebrows: 0, base: 0, },
            accessories: { piercings: 0, hairAccessories: 0, },
            clothing: { outerwear: 0, top: 0, under: 0, },
            hair: { front: 0, back: 0, side: 0, general: 0, },
            background: 0
        },
        hasItems: {
            hasOuterwear: false, hasTop: false, hasGlasses: false, hasPiercings: false,
            hasMakeup: false, hasHairFront: false, hasHairBack: false, hasHairSide: false,
            hasHairAccessories: false, hasAccessories: false,
        },
        avatarItemsOwned: {
            face: { mouth: [], eyes: [], makeup: [], eyebrows: [], base: [], },
            accessories: { glasses: [], piercings: [], accessories: [], hairAccessories: [], },
            clothing: { outerwear: [], top: [], under: [], },
            hair: { front: [], back: [], side: [], general: [], },
            background: [], overlay: [],
        },


        idToView: '', usernameToView: '',
        /*eqipped: {
            glasses: {
                type: 0,
                color:0,
            },
            piercings:{
                type:0,
                color:0,
            },
            hair:{
                color:0,
                frontType:0,
                sideType:0,
                backType:0,
                genType:0,
            },
            outerwear:{
                type:0,
                color:0,
            },
            accessory:{
                type:0,
                color:0,
            },
            top:{
                type:0,
                color:0,
            },
            underlayer:{
                type:0,
                color:0,
            },
            mouth:{
                type:0,
                color:0,
            },
            eyes:{
                type:0,
                color:0,
            },
            makeup:{
                type:0,
                color:0,
            },
            eyebrows:{
                type:0,
                color:0,
            },
            base:{
                type:0,
                color:0,
            },
            hairAccessories:{
                type:0,
                color:0,
            },
            overlay:{
                type:0,
                color:0,
            },
            background: 0,
        }*/
    }
);
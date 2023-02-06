import timeoutApi from '../api/timeout';
import createDataContext from './createDataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { compareAsc, parseISO } from 'date-fns';
const constants = require('../components/constants.json')

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
                //avatarItems: action.payload.user_avatar.avatarItems,
                //avatarColors: action.payload.user_avatar.avatarColors,
                //hasItems: action.payload.user_avatar.hasItems,
                user_id: action.payload.user_info.user_id,
                bio: action.payload.user_info.bio,
                avatarJSON: action.payload.user_avatar.avatarJSON,
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
                bio: action.payload.bio,
            }
        case 'add_points':
            return { ...state, points: parseInt(state.points) + parseInt(action.payload.pointsToAdd) }
        case 'save_avatar':
            return {
                ...state, avatarColors: action.payload.colors, avatarItems: action.payload.items,
                hasItems: action.payload.hasItems,
                base64pfp: action.payload.avatarBase64Data
            }
        case 'save_avatar2':
            return {
                ...state, avatarJSON: action.payload.avatarJSON,
                base64pfp: action.payload.avatarBase64Data,
                points: state.points - action.payload.items_cost,
            }
        case 'clear_response':
            return { ...state, responseMessage: '', errorMessage: '' }
        case 'clear_context':
            return {
                outgoingFriendReqs: [],
                incomingFriendReqs: [],
                friends: [],
                cacheChecker: {},
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
                bio: '',
                avatar_active: false,
                avatarItemsOwned: [],
                avatarJSON: {
                    face: {
                        mouth: {
                            item: 0,
                            color: 0,
                            active: true,
                        },
                        eyes: {
                            item: 0,
                            color: 0,
                            active: true,
                        },
                        makeup: {
                            item: 0,
                            color: 0,
                            active: false,
                        },
                        eyebrows: {
                            item: 0,
                            color: 0,
                            active: true,
                        },
                        base: {
                            item: 0,
                            color: -1,
                            active: true,
                        },
                    },
                    accessories: {
                        hair: {
                            item: 0,
                            color: 0,
                            active: false,
                        },
                        general: {
                            item: 0,
                            color: -1,
                            active: false,
                        },
                        piercings: {
                            item: 0,
                            color: 0,
                            active: false,
                        },
                        glasses: {
                            item: 0,
                            color: 0,
                            active: false,
                        },
                        background: {
                            item: 0,
                            color: -1,
                            active: true,
                        },
                    },
                    clothing: {
                        under: {
                            item: 0,
                            color: 0,
                            active: true,
                        },
                        top: {
                            item: 0,
                            color: 0,
                            active: false,
                        },
                        outer: {
                            item: 0,
                            color: 0,
                            active: false,
                        },
                    },
                    hair: {
                        base: {
                            item: 0,
                            color: 0,
                            active: true,
                        },
                        front: {
                            item: 0,
                            color: 0,
                            active: false,
                        },
                        back: {
                            item: 0,
                            color: 0,
                            active: false,
                        },
                        side: {
                            item: 0,
                            color: 0,
                            active: false,
                        },
                    },
                },
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

        await AsyncStorage.setItem('fetchSelf', JSON.stringify(response.data));
        console.log("fetchSelf complete. Returning this user id: ", response.data)
        const user_id_temp = response.data.user_info
        return user_id_temp;

    } catch (err) {
        console.log("TRYING CACHED SELF INFO")
        var self_cached = await AsyncStorage.getItem('fetchSelf');
        if (self_cached) {
            console.log("GETTING CACHED SELF INFO")
            dispatch({ type: 'fetch_self', payload: JSON.parse(self_cached) })
        }
        dispatch({ type: 'add_error', payload: 'Must be signed in!' })
        return "asdf"
    }
}

const checkAvatarLastUpdated = async (user_id, cur_avatar_dt) => {
    try {
        //console.log("Checking last updated with this user_id: ", user_id)
        let response = await timeoutApi.get(`/avatar12345/last_updated/${user_id}`)
        let last_updated_dt = response.data.last_updated;
        //console.log("LAST UPDATED DT IS ", last_updated_dt)
        var actual_date = new Date(last_updated_dt)
        //console.log(`${user_id}: Last avatar updated: ${actual_date.toISOString()}, and cur cache date: ${new Date(cur_avatar_dt).toISOString()}`)
        var comparison = compareAsc(actual_date, new Date(cur_avatar_dt))
        if (comparison < 0) { // < 0 if last updated is before we retrieve, means we are good
            //console.log("Last updated is before retrieval, no need to retrieve")
            return false
        }
        console.log("DO need to retrieve")
        return true
    } catch (err) {
        return false
    }
}

const fetchAvatarGeneral = dispatch => async (user_id, forceRetrieve = false, isSelf = false) => {
    try {
        var avatar_dt = await AsyncStorage.getItem(`avatar_date_${user_id}`)
        if (!avatar_dt) {
            forceRetrieve = true
        } else if (!forceRetrieve) {
            //forceRetrieve = true

            // check if our version is stale
            let result = await checkAvatarLastUpdated(user_id, avatar_dt);
            result ? forceRetrieve = true : forceRetrieve = false;
        }

        if (forceRetrieve) {
            console.log("Getting avatar from server and user id ", user_id)
            const response = await timeoutApi.get(`/avatar12345/${user_id}`)
            console.log("Got avatar from server")
            var base64Icon = `data:image/png;base64,${response.data}`

            await AsyncStorage.setItem(`avatar_${user_id}`, base64Icon);
            await AsyncStorage.setItem(`avatar_date_${user_id}`, String(new Date()));

            if (isSelf) {
                console.log("is self from server")
                dispatch({ type: 'fetch_avatar', payload: base64Icon })
            }
            return base64Icon;
        } else {
            //console.log("Getting avatar from asyncstorage");

            var base64Icon_cached = await AsyncStorage.getItem(`avatar_${user_id}`);
            if (isSelf) {
                //console.log("is self from cache")
                dispatch({ type: 'fetch_avatar', payload: base64Icon_cached })
            }
            return base64Icon_cached;
        }
    } catch (err) {
        console.log("ERROR", err)
        return constants.defaultBase64;
        //dispatch({ type: 'add_error', payload: 'Must be signed in!' })
    }
}


const fetchAvatar = dispatch => async (forceRetrieve = false) => {
    console.log("fetching profile avatar")
    try {
        var avatar_dt = await AsyncStorage.getItem('user_avatar_date');
        if (!avatar_dt) {
            forceRetrieve = true
        } else {
            //forceRetrieve = true
            avatar_dt = new Date(avatar_dt);
        }
        if (forceRetrieve) {
            console.log("Getting avatar from server")
            const response = await timeoutApi.get('/avatar1')
            //console.log("response is ..... ", response)
            var base64Icon = `data:image/png;base64,${response.data}`

            await AsyncStorage.setItem('user_avatar', base64Icon);
            await AsyncStorage.setItem('user_avatar_date', String(new Date()));
            dispatch({ type: 'fetch_avatar', payload: base64Icon })
        } else {
            console.log("Getting avatar from asyncstorage");

            var base64Icon_cached = await AsyncStorage.getItem('user_avatar');
            dispatch({ type: 'fetch_avatar', payload: base64Icon_cached })
        }
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Must be signed in!' })
    }
}

const fetchAvatarItemsOwned = dispatch => async () => {
    try {
        const response = await timeoutApi.get('/user/owned')
        dispatch({ type: 'fetch_items_owned', payload: response.data })
        console.log("fetchAvatarItemsOwned complete")
    } catch (err) {
        console.log(err)
        dispatch({ type: 'add_error', payload: 'Must be signed in!' })
    }
}

const requestFriend = dispatch => async (codeToRequest, callback, callbackInvalidCode, callbackInvalidRequest) => {
    try {
        const response = await timeoutApi.post('/requestFriend', { codeToRequest })
        if (response.data.resultCode == -1) { // invalid friend code
            if (callbackInvalidCode) { callbackInvalidCode() }
        } else if (response.data.resultCode == -2) { //invalid request
            if (callbackInvalidRequest) { callbackInvalidRequest() }
        } else if (response.data.resultCode == -3) { // other error
            if (callbackInvalidRequest) { callbackInvalidRequest() }
        } else { // all good
            if (callback) { callback() }
        }

    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Problem requesting friend!' })
    }
}

const acceptFriendRequest = dispatch => async (idToAccept, usernameToAccept, callback = null, errorCallback = null) => {
    try {
        await timeoutApi.post('/acceptFriendRequest', { idToAccept })
        dispatch({ type: 'accept_friend', payload: { idToAccept, usernameToAccept } })
        if (callback) { callback() }

    } catch (err) {
        console.log("ERROR accepting friend:", err);
        dispatch({ type: 'add_error', payload: 'Problem accepting friend!' })
        if (errorCallback) { errorCallback() }
    }
}

const rejectFriendRequest = dispatch => async (idToReject, callback = null, errorCallback = null) => {
    try {
        await timeoutApi.post('/rejectFriendRequest', { idToReject })
        dispatch({ type: 'reject_friend', payload: { idToReject } })
        if (callback) { callback() }
    } catch (err) {
        console.log("ERROR rejecting friend request", err);
        dispatch({ type: 'add_error', payload: 'Problem rejecting friend!' })
        if (errorCallback) { errorCallback() }
    }
}

const fetchOutgoingRequests = dispatch => async (callback = null) => {
    try {
        const response = await timeoutApi.get('/friendRequestsOutgoing')
        dispatch({ type: 'request_outgoing_reqs', payload: response.data })
        if (callback) { callback() }
        console.log("fetchOutgoingRequests completed")
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Problem getting outgoing friend reqs!' })
    }
}

const fetchIncomingRequests = dispatch => async (callback = null) => {
    try {
        const response = await timeoutApi.get('/friendRequestsIncoming')
        dispatch({ type: 'request_incoming_reqs', payload: response.data })
        if (callback) { callback() }
        console.log("fetchIncomingRequests completed")
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Problem getting incoming friend reqs!' })
    }
}

const fetchFriends = dispatch => async (callback = null) => {
    try {
        console.log("Fetching friends")
        const response = await timeoutApi.get('/friendsList')
        console.log("Friends results: ", response.data);
        dispatch({ type: 'fetch_friends', payload: response.data })
        if (callback) { callback() }
        console.log("Fetch friends complete")

    } catch (err) {
        console.log("Problem fetching friends:", err)
        dispatch({ type: 'add_error', payload: 'Problem getting friends!' })
    }
};


const fetchFriendsIfUpdate = dispatch => async (callback = null) => {
    try {
        const response = await timeoutApi.get('/friendsUpdate')
        if (response.data == "no update") {
            console.log("No update, friends remain same")
        } else {
            console.log("Update - friends list will be updated")
            dispatch({ type: 'fetch_friends', payload: response.data })
        }
        if (callback) { callback() }
    } catch (err) {
        console.log("Problem fetching friends update:", err)
    }
}

const saveAvatar2 = dispatch => async (user_id, avatarJSON, items_to_redeem, items_cost, callback = null, callback_fail = null) => {
    try {
        console.log("Items to redeem", items_to_redeem)
        const response = await timeoutApi.post('/self_user/avatar2', { avatarJSON, items_to_redeem, items_cost })
        var avatarBase64Data = `data:image/png;base64,${response.data}`
        dispatch({ type: 'save_avatar2', payload: { avatarJSON, avatarBase64Data, items_cost } })

        // save to cache as well
        await AsyncStorage.setItem(`avatar_${user_id}`, avatarBase64Data);
        await AsyncStorage.setItem(`avatar_date_${user_id}`, String(new Date()));

        if (callback) { callback() }
    } catch (err) {
        console.log("Problem saving avatar:", err)
        dispatch({ type: 'add_error', payload: 'Problem saving avatar!' })
        if (callback_fail) { callback_fail() }
    }
}

const saveAvatar = dispatch => async (items, colors, hasItems, callback = null) => {
    try {
        const response = await timeoutApi.post('/self_user/avatar', { items, colors, hasItems })
        var avatarBase64Data = `data:image/png;base64,${response.data}`
        dispatch({ type: 'save_avatar', payload: { items, colors, hasItems, avatarBase64Data } })
        console.log("saving done")

        // save to cache as well
        await AsyncStorage.setItem('user_avatar', avatarBase64Data);
        await AsyncStorage.setItem('user_avatar_date', String(new Date()));

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

const editSelf = dispatch => async (firstName, lastName, username, bio, callback) => {
    try {
        const response = await timeoutApi.patch('/self_user', { firstName, lastName, username, bio })
        dispatch({ type: 'edit_self', payload: { firstName, lastName, username, bio } })
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

const updateLastSignin = dispatch => async (callback = null) => {
    try {
        const response = await timeoutApi.patch('/self_user/lastsignin')
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
        saveAvatar, setIdToView, fetchAvatarItemsOwned, purchaseItems, saveAvatar2, fetchAvatarGeneral,
        fetchFriendsIfUpdate,
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
        bio: '',
        cacheChecker: {},
        avatar_active: false,
        /*avatarItems: {
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
        },*/
        /*avatarItemsOwned: {
            face: { mouth: [], eyes: [], makeup: [], eyebrows: [], base: [], },
            accessories: { glasses: [], piercings: [], accessories: [], hairAccessories: [], },
            clothing: { outerwear: [], top: [], under: [], },
            hair: { front: [], back: [], side: [], general: [], },
            background: [], overlay: [],
        },*/
        avatarItemsOwned: [],
        avatarJSON: {
            face: {
                mouth: {
                    item: 0,
                    color: 0,
                    active: true,
                },
                eyes: {
                    item: 0,
                    color: 0,
                    active: true,
                },
                makeup: {
                    item: 0,
                    color: 0,
                    active: false,
                },
                eyebrows: {
                    item: 0,
                    color: 0,
                    active: true,
                },
                base: {
                    item: 0,
                    color: -1,
                    active: true,
                },
            },
            accessories: {
                hair: {
                    item: 0,
                    color: 0,
                    active: false,
                },
                general: {
                    item: 0,
                    color: -1,
                    active: false,
                },
                piercings: {
                    item: 0,
                    color: 0,
                    active: false,
                },
                glasses: {
                    item: 0,
                    color: 0,
                    active: false,
                },
                background: {
                    item: 0,
                    color: -1,
                    active: true,
                },
            },
            clothing: {
                under: {
                    item: 0,
                    color: 0,
                    active: true,
                },
                top: {
                    item: 0,
                    color: 0,
                    active: false,
                },
                outer: {
                    item: 0,
                    color: 0,
                    active: false,
                },
            },
            hair: {
                base: {
                    item: 0,
                    color: 0,
                    active: true,
                },
                front: {
                    item: 0,
                    color: 0,
                    active: false,
                },
                back: {
                    item: 0,
                    color: 0,
                    active: false,
                },
                side: {
                    item: 0,
                    color: 0,
                    active: false,
                },
            },
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
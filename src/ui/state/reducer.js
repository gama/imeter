import { initialState } from './store'
import { actionTypes }  from './actions'

const reducer = (state = initialState, action) => {
    switch (action.type) {
    // BACKEND FETCH
    case actionTypes.FETCHING:
        return {...state, fetching: action.id,  error: undefined }
    case actionTypes.FETCH_ERROR:
        return {...state, fetching: false, error: action.error, notification: action.notification }

    // BACKEND SAVE
    case actionTypes.SAVING:
        return Object.assign({}, state, { saving: action.id,  error: undefined })
    case actionTypes.SAVE_ERROR:
        return {...state, saving: false, error: action.error, notification: action.notification }

    // BACKEND DELETE
    case actionTypes.DELETING:
        return Object.assign({}, state, { deleting: action.id,  error: undefined })
    case actionTypes.DELETE_ERROR:
        return {...state, deleting: false, error: action.error, notification: action.notification }

    case actionTypes.FETCH_CUSTOMERS:
        return {...state, fetching: false, error: undefined, customers: action.customers }
    case actionTypes.FETCH_USERS:
        return {...state, fetching: false, error: undefined, users: action.users }
    case actionTypes.FETCH_USER:
        return {...state, fetching: false, error: undefined, user: action.user }
    case actionTypes.SAVE_USER:
        return {...state, saving: false, error: undefined, user: action.user, notification: action.notification }
    case actionTypes.DELETE_USER:
        return {...state,  deleting: false, error: undefined, deletedUser: action.userId, notification: action.notification }
    case actionTypes.CLEAR_USER:
        return {...state, fetching: false, error: undefined, user: null }

    // AUTH
    case actionTypes.LOGIN:
        return {...state, fetching: false, auth: { user: action.user } }
    case actionTypes.LOGOUT:
        return {...state, fetching: false, auth: null }

    // NOTIFICATIONS
    case actionTypes.SHOW_NOTIFICATION:
        return {...state,  notification: action }
    case actionTypes.HIDE_NOTIFICATION:
        return {...state,  notification: null }

    default: return state
    }
}

export default reducer

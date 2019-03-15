import { initialState } from './store'
import { actionTypes }  from './actions'

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.TICK:
        return Object.assign({}, state, { lastUpdate: action.ts, light: !!action.light })
    case actionTypes.INCREMENT:
        return Object.assign({}, state, { count: state.count + 1 })
    case actionTypes.DECREMENT:
        return Object.assign({}, state, { count: state.count - 1 })
    case actionTypes.RESET:
        return Object.assign({}, state, { count: initialState.count })

    // BACKEND FETCH
    case actionTypes.FETCHING:
        return Object.assign({}, state, { fetching: action.fetchId,  error: undefined })
    case actionTypes.FETCH_ERROR:
        return Object.assign({}, state, { fetching: false, error: action.error })

    case actionTypes.FETCH_CUSTOMERS:
        return Object.assign({}, state, { fetching: false, error: undefined, customers: action.customers })
    case actionTypes.FETCH_USERS:
        return Object.assign({}, state, { fetching: false, error: undefined, users: action.users })
    case actionTypes.FETCH_USER:
        return Object.assign({}, state, { fetching: false, error: undefined, user: action.user })
    case actionTypes.CLEAR_USER:
        return Object.assign({}, state, { fetching: false, error: undefined, user: null })

    // AUTH
    case actionTypes.LOGIN:
        console.log('LOGGED IN: %o', action)
        return Object.assign({}, state, { fetching: false, auth: { user: action.user } })
    case actionTypes.LOGOUT:
        return Object.assign({}, state, { fetching: false, auth: null })

    default: return state
    }
}

export default reducer

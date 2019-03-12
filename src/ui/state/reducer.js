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
        return Object.assign({}, state, { fetching: true,  error: undefined })
    case actionTypes.FETCH_ERROR:
        return Object.assign({}, state, { fetching: false, error: action.error })

    case actionTypes.FETCH_CUSTOMERS:
        console.log('FETCH CUSTOMERS')
        return Object.assign({}, state, { fetching: false, error: undefined, customers: action.customers })
    case actionTypes.FETCH_USERS:
        console.log('FETCH USERS')
        return Object.assign({}, state, { fetching: false, error: undefined, users: action.users })

    // AUTH
    case actionTypes.LOGIN:
        console.log('LOGGED IN: %o', action)
        return Object.assign({}, state, { fetching: false, user: action.user })
    case actionTypes.LOGOUT:
        return Object.assign({}, state, { fetching: false, user: null })

    default: return state
    }
}

export default reducer

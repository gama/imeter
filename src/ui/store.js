import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {
    lastUpdate: 0,
    light: false,
    count: 0,
    authToken: null
}

export const actionTypes = {
    TICK:      'TICK',
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT',
    RESET:     'RESET',
    LOGIN:     'LOGIN',
    LOGOUT:    'LOGOUT'
}

// REDUCERS
export const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.TICK:
        return Object.assign({}, state, { lastUpdate: action.ts, light: !!action.light })
    case actionTypes.INCREMENT:
        return Object.assign({}, state, { count: state.count + 1 })
    case actionTypes.DECREMENT:
        return Object.assign({}, state, { count: state.count - 1 })
    case actionTypes.RESET:
        return Object.assign({}, state, { count: initialState.count })
    default: return state
    }
}

// ACTIONS
export const serverRenderClock = (isServer) => dispatch => {
    return dispatch({ type: actionTypes.TICK, light: !isServer, ts: Date.now() })
}

export const startClock = dispatch => {
    return setInterval(() => {
        // Dispatch `TICK` every 1 second
        dispatch({ type: actionTypes.TICK, light: true, ts: Date.now() })
    }, 1000)
}

export const incrementCount = () => dispatch => {
    return dispatch({ type: actionTypes.INCREMENT })
}

export const decrementCount = () => dispatch => {
    return dispatch({ type: actionTypes.DECREMENT })
}

export const resetCount = () => dispatch => {
    return dispatch({ type: actionTypes.RESET })
}

export function initializeStore(initialState = initialState) {
    // return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
    return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}

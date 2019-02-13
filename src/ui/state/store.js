import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducer'
// import { composeWithDevTools } from 'redux-devtools-extension'
// import { getCookie } from '../lib/cookies'

export const initialState = {
    lastUpdate: 0,
    light:      false,
    count:      0,
    fetching:   false,
    authToken:  null  // getCookie('authToken')
}

export function initializeStore(initialState = initialState) {
    // return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
    return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}

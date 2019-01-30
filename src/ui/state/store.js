import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducer'
// import { composeWithDevTools } from 'redux-devtools-extension'

export const initialState = {
    lastUpdate: 0,
    light: false,
    count: 0,
    fetching: false,
    authToken: null
}

export function initializeStore(initialState = initialState) {
    // return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
    return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}

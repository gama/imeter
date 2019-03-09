import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducer'
// import { getCookie } from '../lib/cookies'

const composeWithDevTools = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

export const initialState = {
    lastUpdate: 0,
    light:      false,
    count:      0,
    fetching:   false,
    user:       null
}

export function initializeStore(initialState = initialState) {
    return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}

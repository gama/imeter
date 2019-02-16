import Router from 'next/router'
import fetch  from 'isomorphic-unfetch'
import cookie from 'component-cookie'

export const actionTypes = {
    TICK:        'TICK',
    INCREMENT:   'INCREMENT',
    DECREMENT:   'DECREMENT',
    RESET:       'RESET',
    FETCHING:    'FETCHING',
    FETCH_ERROR: 'FETCH_ERROR',
    LOGIN:       'LOGIN',
    LOGOUT:      'LOGOUT'
}

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

export const login = (email, password, rememberMe, nextUrl) => async dispatch => {
    try {
        dispatch({ type: actionTypes.FETCHING })
        const response = await fetchWithPost('/api/auth', { email, password, 'remember-me': rememberMe })
        const data     = await response.json()
        if (!response.ok)
            return dispatch({ type: actionTypes.FETCH_ERROR, error: data})

        dispatch({ type: actionTypes.LOGIN, ...data })
        cookie('authToken', data.token, { expires: dateNDaysInTheFuture(30) })
        Router.push(nextUrl || '/')
    } catch (error) {
        console.error('fetch failed: ', error)
        dispatch({ type: actionTypes.FETCH_ERROR, error: error })
    }
}

export const logout = () => async dispatch => {
    try {
        dispatch({ type: actionTypes.FETCHING })
        const response = await fetchWithDelete('/api/auth')
        if (!response.ok) {
            const data = await response.json()
            return dispatch({ type: actionTypes.FETCH_ERROR, error: data})
        }

        dispatch({ type: actionTypes.LOGOUT })
        cookie('authToken', null)
        Router.push('/login')
    } catch (error) {
        console.error('fetch failed: ', error)
        dispatch({ type: actionTypes.FETCH_ERROR, error: error })
    }
}

const fetchWithPost = async (url, params) => {
    return await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body:   JSON.stringify(params)
    })
}

const fetchWithDelete = async (url) => {
    return await fetch(url, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    })
}

const dateNDaysInTheFuture = (numDays) => {
    return new Date((new Date()).getTime() + (numDays * 24 * 60 * 60))
}

import Router        from 'next/router'
import fetch         from 'isomorphic-unfetch'
import _             from 'lodash'
import { stringify } from 'querystring'
import { saveAuthToken, clearAuthToken } from '../lib/with-auth'

export const actionTypes = {
    TICK:            'TICK',
    INCREMENT:       'INCREMENT',
    DECREMENT:       'DECREMENT',
    RESET:           'RESET',
    SAVING:          'SAVING',
    SAVE_ERROR:      'SAVE_ERROR',
    DELETING:        'DELETING',
    DELETE_ERROR:    'DELETE_ERROR',
    FETCHING:        'FETCHING',
    FETCH_ERROR:     'FETCH_ERROR',
    FETCH_USERS:     'FETCH_USERS',
    FETCH_USER:      'FETCH_USER',
    SAVE_USER:       'SAVE_USER',
    DELETE_USER:     'DELETE_USER',
    CLEAR_USER:      'CLEAR_USER',
    FETCH_CUSTOMERS: 'FETCH_CUSTOMERS',
    LOGIN:           'LOGIN',
    LOGOUT:          'LOGOUT'
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

export const login = (email, password, rememberMe, nextUrl) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.FETCHING, id: 'login' })
        const response = await httpPost('/api/auth', getState(), { email, password, 'remember-me': rememberMe })
        const data     = await response.json()
        if (!response.ok)
            return dispatch({ type: actionTypes.FETCH_ERROR, error: data})

        dispatch({ type: actionTypes.LOGIN, ...data })
        saveAuthToken(data.user.authToken, rememberMe)
        Router.push(nextUrl || '/')
    } catch (error) {
        console.error('fetch failed: ', error)
        dispatch({ type: actionTypes.FETCH_ERROR, error: error })
    }
}

export const logout = () => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.FETCHING, id: 'logout' })
        const response = await httpDelete('/api/auth', getState())
        if (!response.ok) {
            const data = await response.json()
            return dispatch({ type: actionTypes.FETCH_ERROR, error: data})
        }

        dispatch({ type: actionTypes.LOGOUT })
        clearAuthToken()
        Router.push('/login')
    } catch (error) {
        console.error('fetch failed: ', error)
        dispatch({ type: actionTypes.FETCH_ERROR, error: error })
    }
}

export const fetchCustomers = (params) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.FETCHING, id: 'customers' })
        const response = await httpGet('/api/customers', getState(), params)
        const data     = await response.json()
        if (!response.ok)
            return dispatch({ type: actionTypes.FETCH_ERROR, error: data})

        dispatch({ type: actionTypes.FETCH_CUSTOMERS, ...data})
    } catch (error) {
        console.error('fetch failed: ', error)
        dispatch({ type: actionTypes.FETCH_ERROR, error: error })
    }
}

export const fetchUsers = (params) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.FETCHING, id: 'users' })
        const response = await httpGet('/api/users', getState(), params)
        const data     = await response.json()
        if (!response.ok)
            return dispatch({ type: actionTypes.FETCH_ERROR, error: data})

        dispatch({ type: actionTypes.FETCH_USERS, ...data})
    } catch (error) {
        console.error('fetch failed: ', error)
        dispatch({ type: actionTypes.FETCH_ERROR, error: error })
    }
}

export const fetchUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.FETCHING, id: 'user' })
        const response = await httpGet(`/api/users/${id}`, getState())
        const data     = await response.json()
        if (!response.ok)
            return dispatch({ type: actionTypes.FETCH_ERROR, error: data})

        dispatch({ type: actionTypes.FETCH_USER, ...data})
    } catch (error) {
        console.error('fetch failed: ', error)
        dispatch({ type: actionTypes.FETCH_ERROR, error: error })
    }
}

export const createUser = (attrs) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.SAVING, id: 'user' })
        const userAttrs = attrs   //  _.pick(attrs, ['firstName', 'lastName', 'email', 'role'])
        const response  = await httpPost('/api/users', getState(), {user: userAttrs})
        const data      = await response.json()
        if (!response.ok)
            return dispatch({ type: actionTypes.SAVE_ERROR, error: data})

        dispatch({ type: actionTypes.SAVE_USER, ...data})
        Router.push(`/users?id=${data.user.id}`, `/users/${data.user.id}`)
    } catch (error) {
        console.error('fetch failed: ', error)
        dispatch({ type: actionTypes.FETCH_ERROR, error: error })
    }
}

export const updateUser = (attrs) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.SAVING, id: 'user' })
        const userAttrs    = _.pick(attrs, ['firstName', 'lastName', 'email', 'password', 'role'])
        userAttrs.password = userAttrs.password.trim() || undefined
        const response     = await httpPut(`/api/users/${attrs.id}`, getState(), {user: userAttrs})
        if (!response.ok) {
            const data = await response.json()
            return dispatch({ type: actionTypes.SAVE_ERROR, error: data})
        }

        dispatch({ type: actionTypes.SAVE_USER, user: getState().user })
        dispatch(fetchUser(attrs.id))
        Router.push(`/users?id=${attrs.id}`, `/users/${attrs.id}`)
    } catch (error) {
        console.error('fetch failed: ', error)
        dispatch({ type: actionTypes.FETCH_ERROR, error: error })
    }
}

export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.DELETING, id: 'user' })
        const response  = await httpDelete(`/api/users/${id}`, getState())
        if (!response.ok) {
            const data = await response.json()
            return dispatch({ type: actionTypes.DELETE_ERROR, error: data})
        }

        dispatch({ type: actionTypes.DELETE_USER })
        Router.push('/users')
    } catch (error) {
        console.error('fetch failed: ', error)
        dispatch({ type: actionTypes.FETCH_ERROR, error: error })
    }
}

export const clearUser = () => async (dispatch) => {
    dispatch({ type: actionTypes.CLEAR_USER })
}

// -------------------------------------------------------------------

export const buildUrl = (path, params) => {
    const prefix = typeof(window) === 'undefined' ? process.env.IVMETER_API_URL : ''
    return prefix + path + (params ? `?${stringify(params)}` : '')
}

const httpGet = async (path, state, params) => {
    return await fetch(buildUrl(path, params), {
        method: 'GET',
        headers: { Authorization: `Bearer ${state.auth.user.authToken}` }
    })
}

const httpPost = async (path, state, params) => {
    return await fetch(buildUrl(path), {
        method:  'POST',
        body:    JSON.stringify(params),
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${state.auth.user.authToken}`
        }
    })
}

const httpPut = async (path, state, params) => {
    return await fetch(buildUrl(path), {
        method:  'PUT',
        body:    JSON.stringify(params),
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${state.auth.user.authToken}`
        }
    })
}

const httpDelete = async (path, state) => {
    return await fetch(buildUrl(path), {
        method:  'DELETE',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${state.auth.user.authToken}`
        }
    })
}

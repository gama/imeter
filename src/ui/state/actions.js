import Router        from 'next/router'
import fetch         from 'isomorphic-unfetch'
import _             from 'lodash'
import { stringify } from 'querystring'
import { saveAuthToken, clearAuthToken } from '../lib/with-auth'

export const actionTypes = {
    LOGIN:             'LOGIN',
    LOGOUT:            'LOGOUT',
    SAVING:            'SAVING',
    SAVE_ERROR:        'SAVE_ERROR',
    DELETING:          'DELETING',
    DELETE_ERROR:      'DELETE_ERROR',
    FETCHING:          'FETCHING',
    FETCH_ERROR:       'FETCH_ERROR',
    FETCH_USERS:       'FETCH_USERS',
    FETCH_USER:        'FETCH_USER',
    SAVE_USER:         'SAVE_USER',
    DELETE_USER:       'DELETE_USER',
    CLEAR_USER:        'CLEAR_USER',
    FETCH_CUSTOMERS:   'FETCH_CUSTOMERS',
    SHOW_NOTIFICATION: 'SHOW_NOTIFICATION', 
    HIDE_NOTIFICATION: 'HIDE_NOTIFICATION'
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
    dispatch({ type: actionTypes.FETCHING, id: 'users' })
    try {
        const response = await httpGet('/api/users', getState(), params)
        const data     = await response.json()
        if (!response.ok)
            throw data

        dispatch({ type: actionTypes.FETCH_USERS, ...data})
    } catch (error) {
        console.error('fetch failed: ', error)
        dispatch({ type: actionTypes.FETCH_ERROR, id: 'customer', error: error })
    }
}

export const fetchUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.FETCHING, id: 'user' })
        const response = await httpGet(`/api/users/${id}`, getState())
        const data     = await response.json()
        if (!response.ok)
            throw data

        dispatch({ type: actionTypes.FETCH_USER, ...data})
    } catch (error) {
        console.error('fetch failed: ', error)
        dispatch({ type: actionTypes.FETCH_ERROR, id: 'user', error, ...errorNotification(`Unable to fetch user ${id}: ${error}`) })
    }
}

export const createUser = (attrs) => async (dispatch, getState) => {
    dispatch({ type: actionTypes.SAVING, id: 'user' })
    const userAttrs = _.pick(attrs, ['firstName', 'lastName', 'email', 'role'])

    try {
        const response  = await httpPost('/api/users', getState(), {user: userAttrs})
        const data      = await response.json()
        if (!response.ok)
            throw data

        dispatch({ type: actionTypes.SAVE_USER, ...data, ...successNotification(`User ${attrs.id} created successfully`) })
        Router.push(`/users?id=${data.user.id}`, `/users/${data.user.id}`)
    } catch (error) {
        console.error('create user failed: ', error)
        dispatch({ type: actionTypes.SAVE_ERROR, error, ...errorNotification(`Unable to create user ${attrs.id}: ${error}`) })
    }
}

export const updateUser = (attrs) => async (dispatch, getState) => {
    dispatch({ type: actionTypes.SAVING, id: 'user' })
    attrs.password  = attrs.password.trim() || undefined
    const userAttrs = _.pick(attrs, ['firstName', 'lastName', 'email', 'password', 'role'])

    try {
        const response = await httpPut(`/api/users/${attrs.id}`, getState(), {user: userAttrs})
        const data     = await response.json()
        if (!response.ok)
            throw data

        dispatch({ type: actionTypes.SAVE_USER, ...data, ...successNotification(`User ${attrs.id} updated successfully`) })
        Router.push(`/users?id=${attrs.id}`, `/users/${attrs.id}`)
    } catch (error) {
        console.error('update user failed: %o', error.error || error)
        dispatch({ type: actionTypes.SAVE_ERROR, error, ...errorNotification(`Unable to update user ${attrs.id}: ${error.error || error}`) })
    }
}

export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: actionTypes.DELETING, id: 'user' })
        const response = await httpDelete(`/api/users/${id}`, getState())
        if (!response.ok)
            throw await response.json()

        dispatch({ type: actionTypes.DELETE_USER, ...successNotification(`Deleted user ${id} successfully`) })
        Router.push('/users')
    } catch (error) {
        console.error('delete user failed: ', error)
        dispatch({ type: actionTypes.DELETE_ERROR, error: error, ...errorNotification(`Unable to delete user ${id}: ${error}`) })
    }
}

export const clearUser = () => async (dispatch) => {
    dispatch({ type: actionTypes.CLEAR_USER })
}

export const showNotification = (message, title, timeout, category) => async (dispatch) => {
    dispatch({ type: actionTypes.SHOW_NOTIFICATION, ...(notification({ title, message, timeout, category }).notification) })
}

export const hideNotification = () => async (dispatch) => {
    dispatch({ type: actionTypes.HIDE_NOTIFICATION })
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

/* eslint-disable no-unused-vars */
const notification        = ({ category='primary', message, title, timeout=3000 }) => ({ notification: { category, message, title, timeout } })
const primaryNotification = (message, title, timeout) => notification({ category: 'primary', message, title, timeout })
const linkNotification    = (message, title, timeout) => notification({ category: 'link',    message, title, timeout })
const infoNotification    = (message, title, timeout) => notification({ category: 'info',    message, title, timeout })
const successNotification = (message, title, timeout) => notification({ category: 'success', message, title, timeout })
const warningNotification = (message, title, timeout) => notification({ category: 'warning', message, title, timeout: timeout || 5000 })
const errorNotification   = (message, title, timeout) => notification({ category: 'danger',  message, title, timeout: timeout || 5000 })

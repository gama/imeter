import React        from 'preact'
import Router       from 'next/router'
import nextCookie   from 'next-cookies'
import cookie       from 'component-cookie'
import { buildUrl } from '../state/actions'

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000  // 30 days in ms

export function saveAuthToken(authToken, remember) {
    const params = remember ? { maxage: COOKIE_MAX_AGE } : undefined
    cookie('authToken', authToken, params)
}

export function clearAuthToken() {
    cookie('authToken', null)
}

export default function withAuth(App) {
    return class AppWithAuth extends React.Component {
        static async getInitialProps(appContext) {
            await this.updateStateWithAuth(appContext.ctx)

            let appProps = {}
            if (typeof App.getInitialProps === 'function')
                appProps = await App.getInitialProps(appContext)

            if (this.isAuthenticated(appContext.ctx) || this.skipAuthForPage(appProps))
                return appProps

            this.redirect('/login', appContext.ctx)
        }

        static skipAuthForPage(appProps) {
            return !appProps.pageProps || appProps.pageProps.skipAuth
        }

        static isAuthenticated(context) {
            return Boolean(context.reduxStore.getState().user)
        }

        static async updateStateWithAuth(context) {
            const { authToken } = nextCookie(context)
            if (!authToken)
                return

            const state = context.reduxStore.getState()
            if (state.user && state.user.authToken === authToken)
                return

            if (process.browser)
                throw new Error('state.user should be set on SSR or by the login action')

            Object.assign(state, { user: await this.fetchCurrentUser(context, authToken) })
        }

        static async fetchCurrentUser(context, authToken) {
            const headers = { 'Authorization': 'Bearer ' + authToken }
            const resp    = await fetch(buildUrl('/api/auth'), { headers })
            const json    = await resp.json()
            return { ...json.user, authToken: authToken }
        }

        static redirect(url, ctx) {
            console.debug('REDIRECTING TO ' + url)
            if (process.browser)
                return Router.push(url)
            ctx.res.writeHead(302, { Location: url })
            ctx.res.end()
        }

        constructor(props) {
            super(props)
        }

        render() {
            return <App {...this.props} />
        }
    }
}

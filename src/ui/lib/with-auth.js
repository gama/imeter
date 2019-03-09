import React      from 'preact'
import Router     from 'next/router'
import nextCookie from 'next-cookies'

export default function withAuth(App) {
    return class AppWithAuth extends React.Component {
        static async getInitialProps(appContext) {
            let appProps = {}
            if (typeof App.getInitialProps === 'function')
                appProps = await App.getInitialProps(appContext)

            if (this.skipAuthForPage(appProps) || this.isAuthenticated(appContext.ctx)) {
                await this.updateStateWithAuth(appContext.ctx)
                return appProps
            }

            this.redirect('/login', appContext.ctx)
        }

        static skipAuthForPage(appProps) {
            return !appProps.pageProps || appProps.pageProps.skipAuth
        }

        static isAuthenticated(context) {
            return !!nextCookie(context).authToken
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
            const resp    = await fetch(this.currentUserUrl(context), { headers })
            const json    = await resp.json()
            return json.user
        }

        static currentUserUrl(context) {
            return 'http://' + context.req.headers.host + '/api/auth'
        }

        static redirect(url, ctx) {
            console.debug('REDIRECTING TO ' + url)
            if (process.browser) {  // eslint-disable-line no-undef
                Router.push(url)
            } else {
                ctx.res.writeHead(302, { Location: url })
                ctx.res.end()
            }
        }

        constructor(props) {
            super(props)
        }

        render() {
            return <App {...this.props} />
        }
    }
}

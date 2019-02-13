import React      from 'preact'
import Router     from 'next/router'
import nextCookie from 'next-cookies'

export default function withAuth(App) {
    return class AppWithAuth extends React.Component {
        static async getInitialProps(appContext) {
            let appProps = {}
            if (typeof App.getInitialProps === 'function')
                appProps = await App.getInitialProps(appContext)

            if (this.skipAuthForPage(appProps) || this.hasAuthToken(appContext.ctx)) {
                this.updateStateWithAuthToken(appContext.ctx)
                return appProps
            }

            this.redirect('/login', appContext.ctx)
        }

        static skipAuthForPage(appProps) {
            return !appProps.pageProps || appProps.pageProps.skipAuth
        }

        static hasAuthToken(context) {
            return !!nextCookie(context).authToken
            // return appContext.ctx.reduxStore.getState().authToken
        }

        static updateStateWithAuthToken(context) {
            const { authToken } = nextCookie(context)
            Object.assign(context.reduxStore.getState(), { authToken })
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

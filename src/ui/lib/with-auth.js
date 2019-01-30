import React  from 'preact'
import Router from 'next/router'

export default function withAuth(App) {
    return class AppWithAuth extends React.Component {
        static async getInitialProps(appContext) {
            let appProps = {}
            if (typeof App.getInitialProps === 'function')
                appProps = await App.getInitialProps(appContext)

            if (this.skipAuthForPage(appProps) || this.hasAuthToken(appContext))
                return appProps

            this.redirect('/login', appContext.ctx)
        }

        static skipAuthForPage(appProps) {
            return !appProps.pageProps || appProps.pageProps.skipAuth
        }

        static hasAuthToken(appContext) {
            return appContext.ctx.reduxStore.authToken
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

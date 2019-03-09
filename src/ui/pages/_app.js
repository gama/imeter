import React                  from 'preact'
import NextApp, { Container } from 'next/app'
import { Provider }           from 'preact-redux'
import withReduxStore         from '../lib/with-redux-store'
import withAuth               from '../lib/with-auth'

import 'preact/debug'

class App extends NextApp {
    static async getInitialProps(appContext) {
        let pageProps = {}
        if (appContext.Component.getInitialProps) 
            pageProps = await appContext.Component.getInitialProps(appContext.ctx)
        return { pageProps }
    }

    render() {
        const { Component, pageProps, reduxStore } = this.props
        return (
            <Container>
                <Provider store={reduxStore}>
                    <Component {...pageProps} />
                </Provider>
            </Container>
        )
    }
}

export default withReduxStore(withAuth(App))

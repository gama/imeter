import React                  from 'preact'
import NextApp, { Container } from 'next/app'
import { Provider }           from 'preact-redux'
import withReduxStore         from '../lib/with-redux-store'
import withAuth               from '../lib/with-auth'

class App extends NextApp {
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

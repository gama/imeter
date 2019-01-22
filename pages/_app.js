import React                  from 'preact'
import NextApp, { Container } from 'next/app'
import withReduxStore         from '../lib/with-redux-store'
import { Provider }           from 'preact-redux'

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

export default withReduxStore(App)

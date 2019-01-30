/* eslint-disable no-console */

import React  from 'preact'
import Layout from '../components/layout'

class LoginPage extends React.Component {
    static getInitialProps() {
        return {skipAuth: true}
    }

    render() {
        return (
            <Layout>
                <h1 className="title">Login</h1>
                <div className="panel">
                    <label htmlFor="username">Username</label>
                    <input name="username" />

                    <label htmlFor="password">Password</label>
                    <input name="password" />
                </div>
            </Layout>
        )
    }
}

export default LoginPage

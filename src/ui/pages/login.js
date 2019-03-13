/* eslint-disable no-console */

import React       from 'preact'
import { connect } from 'preact-redux'
import Layout      from '../components/layout'
import LoginForm   from '../components/login-form'
import { login }   from '../state/actions'
import styles      from '../styles/login.sass'

class LoginPage extends React.Component {
    static getInitialProps() {
        return {skipAuth: true}
    }

    render({ login, error }) {
        return (
            <Container>
                <h1 className="title">Login</h1>
                <LoginForm onSubmit={(...args) => login(...args)} error={error} />
            </Container>
        )
    }
}

function Container({ children }) {
    return (
        <Layout>
            <div className={'container ' + styles.container}>
                <div className="card">
                    <div className="card-content">{children}</div>
                </div>
            </div>
        </Layout>
    )
}

const mapStateToProps = (state) => ({ error: state.error })
const actions = { login }
export default connect(mapStateToProps, actions)(LoginPage)

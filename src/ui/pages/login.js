import React       from 'preact'
import { connect } from 'preact-redux'
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
        <div className={'container ' + styles.container}>
            <div className="card">
                <div className="card-content">{children}</div>
            </div>
        </div>
    )
}

const stateToProps = (state) => ({ error: state.error })
const actions      = { login }
export default connect(stateToProps, actions)(LoginPage)

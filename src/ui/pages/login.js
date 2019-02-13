/* eslint-disable no-console */

import React       from 'preact'
import { connect } from 'preact-redux'
import Layout      from '../components/layout'
import LoginForm   from '../components/login-form'
import { login }   from '../state/actions'

class LoginPage extends React.Component {
    static getInitialProps() {
        return {skipAuth: true}
    }

    render(props) {
        return (
            <Container>
                <h1 className="title">Login</h1>
                <LoginForm onSubmit={(...args) => props.login(...args)} error={props.error} />
            </Container>
        )
    }
}

function Container(props) {
    return (
        <Layout>
            <div className="container" style={style.container}>
                <div className="card">
                    <div className="card-content">
                        {props.children}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

const style = {
    container: {
        'max-width': '30em'
    }
}

const mapStateToProps = (state) => ({ error: state.error })
const actions = { login }

export default connect(mapStateToProps, actions)(LoginPage)

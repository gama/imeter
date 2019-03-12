import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import Layout               from '../components/layout'
import AdminIndex           from '../components/admin-index'
import CustomerIndex        from '../components/customer-index'
import OperatorIndex        from '../components/operator-index'

const components = {
    'admin':    AdminIndex,
    'customer': CustomerIndex,
    'operator': OperatorIndex
}

class Index extends Component {
    static getInitialProps({ reduxStore }) {
        console.log('INDEX GET_INITIAL_PROPS; state: %o', reduxStore.getState())
        const user = reduxStore.getState().user
        return user ? components[user.role].getInitialProps({ reduxStore }) : {}
    }

    render({ user }) {
        const Component = components[user.role]
        return (
            <Layout>
                <Component />
            </Layout>
        )
    }
}

const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps)(Index)

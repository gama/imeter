import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import Router               from 'next/router'
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
        const auth = reduxStore.getState().auth
        return auth && auth.user ? components[auth.user.role].getInitialProps({ reduxStore }) : {}
    }

    render({ user }) {
        if (!user)
            return Router.push('/login')

        const Component = components[user.role]
        return (
            <Layout>
                <Component />
            </Layout>
        )
    }
}

const mapStateToProps = ({ auth }) => ({ user: auth && auth.user })
export default connect(mapStateToProps)(Index)

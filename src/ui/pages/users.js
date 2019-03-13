import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import Layout               from '../components/layout'
import SearchBox            from '../components/crud/search'
import EntityTable          from '../components/crud/table'
import { fetchUsers }       from '../state/actions'
import styles               from '../styles/customers.sass'

class Users extends Component {
    static async getInitialProps({ reduxStore }) {
        await reduxStore.dispatch(fetchUsers())
    }

    render({ fetching, users, fetchUsers }) {
        return (
            <Layout>
                <h1 className="title">Users</h1>
                <div className="columns">
                    <div className={'column ' + styles.indexcolumn}>
                        {<SearchBox onChange={(filter) => fetchUsers({filter})} />}
                        <EntityTable overlayed={fetching} headers={['Name', 'Email']} items={users} itemComponent={User} />
                    </div>
                </div>
            </Layout>
        )
    }
}

function User({ firstName, lastName, email }) {
    return (
        <tr>
            <td>{`${firstName} ${lastName}`}</td>
            <td>{email}</td>
        </tr>
    )
}

const mapStateToProps = ({ fetching, users }) => ({ fetching, users })
const actions = { fetchUsers }
export default connect(mapStateToProps, actions)(Users)

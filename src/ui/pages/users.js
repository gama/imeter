import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import { fetchUsers }       from '../state/actions'
import Layout               from '../components/layout'
import EntityTable          from '../components/crud/table'
import styles               from '../styles/customers.sass'

const DEFAULT_API_PARAMS = { filter: null, page: 1, per_page: 4 }

class Users extends Component {
    static async getInitialProps({ reduxStore }) {
        await reduxStore.dispatch(fetchUsers(DEFAULT_API_PARAMS))
    }

    constructor(props) {
        super(props)
        this.state = DEFAULT_API_PARAMS
    }

    onSearch(filter) {
        this.setState({filter, page: 1}, () => this.props.fetchUsers(this.state))
    }

    onPaginate(page) {
        this.setState({page}, () => this.props.fetchUsers(this.state))
    }

    render({ fetching, users }) {
        return (
            <Layout>
                <h1 className="title">Users</h1>
                <div className="columns">
                    <div className={'column ' + styles.indexcolumn}>
                        <EntityTable
                            overlayed={fetching} headers={['Name', 'Email']} items={users} itemComponent={User}
                            page={this.state.page} perPage={this.state.per_page} onPaginate={this.onPaginate.bind(this)}
                            onSearch={this.onSearch.bind(this)} />
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

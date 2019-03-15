import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import { withRouter }       from 'next/router'
import Link                 from 'next/link'
import { fetchUser }        from '../state/actions'
import { fetchUsers }       from '../state/actions'
import { clearUser }        from '../state/actions'
import Layout               from '../components/layout'
import EntityTable          from '../components/crud/table'

const DEFAULT_API_PARAMS = { filter: null, page: 1, per_page: 4 }

class Users extends Component {
    static async getInitialProps({ reduxStore, query }) {
        await reduxStore.dispatch(fetchUsers(DEFAULT_API_PARAMS))
        if (query.id)
            await reduxStore.dispatch(fetchUser(query.id))
    }

    constructor(props) {
        super(props)
        this.state = { ...DEFAULT_API_PARAMS, userId: props.router.query.id }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.router.query.id !== newProps.router.query.id) {
            if (newProps.router.query.id)
                newProps.dispatch(fetchUser(newProps.router.query.id))
            else
                newProps.dispatch(clearUser())
        }
    }

    onSearch(filter) {
        this.setState({filter, page: 1}, () => this.props.dispatch(fetchUsers(this.state)))
    }

    onPaginate(page) {
        this.setState({page}, () => this.props.dispatch(fetchUsers(this.state)))
    }

    render({ fetching, user, users }) {
        return (
            <Layout>
                <h1 className="title">Users</h1>
                <div className="columns">
                    <div className="column">
                        <EntityTable
                            overlayed={fetching === 'users'} headers={['Name', 'Email']} items={users} itemComponent={User}
                            page={this.state.page} perPage={this.state.per_page} onPaginate={this.onPaginate.bind(this)}
                            onSearch={this.onSearch.bind(this)} />
                    </div>
                    {user && <UserDetails {...user} />}
                </div>
            </Layout>
        )
    }
}

function User({ id, firstName, lastName, email }) {
    return (
        <Link key={id} href={`/users?id=${id}`} as={`/users/${id}`} shallow={true}>
            <tr className='is-link'>
                <td>{`${firstName} ${lastName}`}</td>
                <td>{email}</td>
            </tr>
        </Link>
    )
}

function UserDetails({ id, firstName, lastName, email, role }) {
    return (
        <div className="column is-one-third">
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">User {id} &nbsp;&ndash;&nbsp; {role}</p>
                    <Link href="/users" shallow={true}>
                        <a className="card-header-icon" aria-label="close">
                            <span className="icon">
                                <i className="fa fa-close" aria-hidden="true"></i>
                            </span>
                        </a>
                    </Link>
                </header>
                <div className="card-content">
                    <div className="content">
                        <div className="field is-horizontal">
                            <div className="field-label">
                                <label htmlFor="name" className="label">Name</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">{firstName} {lastName}</div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label">
                                <label htmlFor="email" className="label">Email</label>
                            </div>
                            <div className="field-body">
                                <div className="field">{email}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="card-footer">
                </footer>
            </div>
        </div>
    )
}

const mapStateToProps = ({ fetching, users, user }) => ({ fetching, users, user })
export default withRouter(connect(mapStateToProps)(Users))

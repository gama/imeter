import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import { withRouter }       from 'next/router'
import Link                 from 'next/link'
import { fetchUser  }       from '../state/actions'
import { fetchUsers }       from '../state/actions'
import { clearUser  }       from '../state/actions'
import { createUser }       from '../state/actions'
import { updateUser }       from '../state/actions'
import { deleteUser }       from '../state/actions'
import Layout               from '../components/layout'
import EntityTable          from '../components/crud/table'
import UserDetails          from '../components/users/details'
import UserForm             from '../components/users/form'

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
        console.log(newProps.router.query)
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

    onSave(attrs) {
        const action = (attrs.id) ? updateUser : createUser
        this.props.dispatch(action(attrs))
    }

    onDelete(id) {
        this.props.dispatch(deleteUser(id))
    }

    render({ fetching, user, users, router }) {
        console.log('router.query: %o', router.query)
        return (
            <Layout>
                <h1 className="title">Users</h1>
                <div className="columns">
                    <div className="column">
                        <EntityTable
                            overlayed={fetching === 'users'} headers={['Name', 'Email']} items={users} itemComponent={User}
                            page={this.state.page} perPage={this.state.per_page} onPaginate={this.onPaginate.bind(this)}
                            onSearch={this.onSearch.bind(this)} />
                        <Link href="/users?action=new" as="/users/new">
                            <a className="button is-primary">
                                <span className="icon is-small is-pulled-right"><i className="mdi mdi-plus"></i></span>
                                <span>New User</span>
                            </a>
                        </Link>
                    </div>
                    {!user && router.query.action === 'new'  && <UserForm    onSave={this.onSave.bind(this)} {...user} />}
                    { user && router.query.action === 'edit' && <UserForm    onSave={this.onSave.bind(this)} {...user} />}
                    { user && router.query.action !== 'edit' && <UserDetails onDelete={this.onDelete.bind(this)} {...user} />}
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

const mapStateToProps = ({ fetching, users, user }) => ({ fetching, users, user })
export default withRouter(connect(mapStateToProps)(Users))

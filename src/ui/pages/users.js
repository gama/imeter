import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import { withRouter }       from 'next/router'
import Link                 from 'next/link'
import { pick }             from 'lodash'
import { fetchUser  }       from '../state/actions'
import { fetchUsers }       from '../state/actions'
import { clearUser  }       from '../state/actions'
import { createUser }       from '../state/actions'
import { updateUser }       from '../state/actions'
import { deleteUser }       from '../state/actions'
import EntityTable          from '../components/crud/table'
import UserDetails          from '../components/users/details'
import UserForm             from '../components/users/form'

const DEFAULT_API_PARAMS = { filter: null, page: 1, per_page: 4 }

class Users extends Component {
    static async getInitialProps({ reduxStore, asPath, pathname, query }) {
        console.log('USER PAGE GET_INITIAL_PROPS (pathname: %s, asPath: %s, query: %o)', pathname, asPath, query)
        await reduxStore.dispatch(fetchUsers({ ...DEFAULT_API_PARAMS, ...query }))
        if (query.id)
            await reduxStore.dispatch(fetchUser(query.id))
    }

    constructor(props) {
        console.log('USER PAGE CONSTRUCTOR')
        super(props)

        this.onSearch   = this.onSearch.bind(this)
        this.onPaginate = this.onPaginate.bind(this)
        this.onSave     = this.onSave.bind(this)
        this.onDelete   = this.onDelete.bind(this)

        const { id: userId, ...query } = props.router.query
        this.state = {...DEFAULT_API_PARAMS, ...query, userId }
    }

    componentWillReceiveProps(newProps) {
        console.log('USER PAGE WILL RECEIVE PROPS')
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
        this.props.dispatch(action(attrs, this.redirectParams()))
    }

    onDelete(id) {
        this.props.dispatch(deleteUser(id, this.redirectParams()))
    }

    redirectParams() {
        return pick(this.state, ['page', 'per_page', 'filter'])
    }

    render({ fetching, user, users, router }) {
        return (
            <span>
                <h1 className="title">Users</h1>
                <div className="columns">
                    <div className="column">
                        <EntityTable overlayed={fetching === 'users'} headers={['Name', 'Email']}
                            items={users} itemComponent={User}
                            page={this.state.page} perPage={this.state.per_page} onPaginate={this.onPaginate}
                            onSearch={this.onSearch} />
                        <NewButton />
                    </div>
                    <DetailsColumn userId={router.query.id} action={router.query.action} user={user}
                        onSave={this.onSave} onDelete={this.onDelete} />
                </div>
            </span>
        )
    }
}

function DetailsColumn({ userId, action, user, onSave, onDelete }) {
    if (action === 'new' || action === 'edit')
        return <UserForm    onSave={onSave}     {...user} />
    if (userId)
        return <UserDetails onDelete={onDelete} {...user} />
}

function User({ id, firstName, lastName, email }) {
    return (
        <Link href={`/users?id=${id}`} as={`/users/${id}`} shallow={true}>
            <tr className='is-link'>
                <td>{`${firstName} ${lastName}`}</td>
                <td>{email}</td>
            </tr>
        </Link>
    )
}

function NewButton() {
    return (
        <Link href="/users?action=new" as="/users/new" shallow={true}>
            <a className="button is-primary">
                <span className="icon is-small is-pulled-right"><i className="mdi mdi-plus"></i></span>
                <span>New User</span>
            </a>
        </Link>
    )
}

const mapStateToProps = ({ fetching, users, user }) => ({ fetching, users, user })
export default withRouter(connect(mapStateToProps)(Users))

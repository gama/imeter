import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import { withRouter }       from 'next/router'
import { pick }             from 'lodash'
import { fetchUser  }       from '../state/actions'
import { fetchUsers }       from '../state/actions'
import { clearUser  }       from '../state/actions'
import { createUser }       from '../state/actions'
import { updateUser }       from '../state/actions'
import { deleteUser }       from '../state/actions'
import UserTable            from '../components/users/table'
import UserDetails          from '../components/users/details'
import UserForm             from '../components/users/form'

const DEFAULT_API_PARAMS = { filter: null, page: 1, per_page: 4 }

class Users extends Component {
    static async getInitialProps({ reduxStore, query }) {
        await reduxStore.dispatch(fetchUsers({ ...DEFAULT_API_PARAMS, ...query }))
        if (query.id)
            await reduxStore.dispatch(fetchUser(query.id))
    }

    constructor(props) {
        super(props)

        this.onSearch   = this.onSearch.bind(this)
        this.onPaginate = this.onPaginate.bind(this)
        this.onSave     = this.onSave.bind(this)
        this.onDelete   = this.onDelete.bind(this)

        const { id: userId, ...query } = props.router.query
        this.state = {...DEFAULT_API_PARAMS, ...query, userId }
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

    render({ fetching, user, users, router }, {page, per_page}) {
        return (
            <span>
                <h1 className="title">Users</h1>
                <div className="columns">
                    <ListColumn fetching={fetching} users={users} page={page} perPage={per_page}
                        onPaginate={this.onPaginate} onSearch={this.onSearch} />
                    <DetailsColumn userId={router.query.id} action={router.query.action} user={user}
                        onSave={this.onSave} onDelete={this.onDelete} />
                </div>
            </span>
        )
    }
}

const ListColumn = (props) => (
    <div className="column">
        <UserTable {...props} />
    </div>
)

const DetailsColumn = ({ userId, action, user, onSave, onDelete }) => {
    if (action === 'new' || action === 'edit')
        return <div className="column is-two-fifths"><UserForm onSave={onSave} {...user} /></div>
    if (userId)
        return <div className="column is-two-fifths"><UserDetails onDelete={onDelete} {...user} /></div>
}

const mapStateToProps = ({ fetching, users, user }) => ({ fetching, users, user })
export default withRouter(connect(mapStateToProps)(Users))

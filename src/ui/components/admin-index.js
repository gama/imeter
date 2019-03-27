import React                          from 'preact'
import { connect }                    from 'preact-redux'
import { fetchCustomers, fetchUsers } from '../state/actions'

class AdminIndex extends React.Component {
    static async getInitialProps({ reduxStore }) {
        await reduxStore.dispatch(fetchCustomers({sort: '-id', per_page: 3}))
        await reduxStore.dispatch(fetchUsers({sort: '-id', per_page: 3}))
        return {}
    }

    render({ customers, users }) {
        return (
            <span>
                <h2 className="title">Customers & Users Management</h2>
                <div className="columns">
                    <div className="column">
                        <div className="panel">
                            <p className="panel-heading">Latest Customers</p>
                            <div className="panel-block">
                                <table className="table is-striped is-fullwidth">
                                    <tbody>
                                        {customers.map(customer => <Customer key={customer.id} {...customer} />)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="panel">
                            <p className="panel-heading">Latest Users</p>
                            <div className="panel-block">
                                <table className="table is-striped is-fullwidth">
                                    <tbody>
                                        {users.map(user => <User key={user.id} {...user} />)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        )
    }
}

function Customer(props) {
    return (<tr><td>{props.name}</td></tr>)
}

function User(props) {
    return (
        <tr>
            <td>{props.email}</td>
            <td>{props.firstName + ' ' + props.lastName}</td>
            <td>{props.customer}</td>
        </tr>
    )
}

const mapStateToProps = ({ customers, users }) => ({ customers, users })
export default connect(mapStateToProps)(AdminIndex)

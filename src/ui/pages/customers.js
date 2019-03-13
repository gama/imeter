import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import Layout               from '../components/layout'
import SearchBox            from '../components/crud/search'
import EntityTable          from '../components/crud/table'
import { fetchCustomers }   from '../state/actions'
import styles               from '../styles/customers.sass'

class Customers extends Component {
    static async getInitialProps({ reduxStore }) {
        await reduxStore.dispatch(fetchCustomers())
    }

    render({ fetching, customers, fetchCustomers }) {
        return (
            <Layout>
                <h1 className="title">Customers</h1>
                <div className="columns">
                    <div className={'column ' + styles.indexcolumn}>
                        <SearchBox onChange={(filter) => fetchCustomers({filter})} />
                        <EntityTable overlayed={fetching} headers={['Name']} items={customers} itemComponent={Customer} />
                    </div>
                </div>
            </Layout>
        )
    }
}

function Customer({ name }) {
    return (<tr><td>{name}</td></tr>)
}

const mapStateToProps = ({ fetching, customers }) => ({ fetching, customers })
const actions = { fetchCustomers }
export default connect(mapStateToProps, actions)(Customers)

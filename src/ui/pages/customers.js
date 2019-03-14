import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import { fetchCustomers }   from '../state/actions'
import Layout               from '../components/layout'
import EntityTable          from '../components/crud/table'

const DEFAULT_API_PARAMS = {filter: null, page: 1, per_page: 20}

class Customers extends Component {
    static async getInitialProps({ reduxStore }) {
        await reduxStore.dispatch(fetchCustomers(DEFAULT_API_PARAMS))
    }

    onSearch(filter) {
        this.setState({ filter, page: 1 }, () => this.props.dispatch(fetchCustomers(this.state)))
    }

    onPaginate(page) {
        this.setState({ page }, () => this.props.dispatch(fetchCustomers(this.state)))
    }

    render({ fetching, customers }) {
        return (
            <Layout>
                <h1 className="title">Customers</h1>
                <div className="columns"><div className="column">
                    <EntityTable
                        overlayed={fetching} headers={['Name']} items={customers} itemComponent={Customer}
                        onSearch={this.onSearch.bind(this)}
                        onPaginate={this.onPaginate.bind(this)} />
                </div></div>
            </Layout>
        )
    }
}

function Customer({ name }) {
    return (<tr><td>{name}</td></tr>)
}

const mapStateToProps = ({ fetching, customers }) => ({ fetching, customers })
export default connect(mapStateToProps)(Customers)

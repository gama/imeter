import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import Layout               from '../components/layout'
import { fetchCustomers }   from '../state/actions'
import styles               from '../styles/customers.sass'

class Customers extends Component {
    static async getInitialProps({ reduxStore }) {
        await reduxStore.dispatch(fetchCustomers())
    }

    constructor(props) {
        super(props)
        this.fetchCustomers = props.fetchCustomers
    }

    onSearch(value) {
        this.fetchCustomers({ query: value })
    }

    render({ customers }) {
        return (
            <Layout>
                <h1 className="title">Customers</h1>
                <div className="columns">
                    <div className={'column ' + styles.indexcolumn}>
                        <SearchBox onChange={this.onSearch.bind(this)} />
                        <table className="table is-striped is-fullwidth">
                            <thead>
                                <tr><th>Name</th></tr>
                            </thead>
                            <tbody>
                                {customers.map(customer => <Customer key={customer.id} {...customer} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Layout>
        )
    }
}

function SearchBox(props) {
    const input = React.createRef()

    let timer
    const delayedOnChange = () => {
        if (timer)
            clearTimeout(timer)
        timer = setTimeout(() => {
            timer = null
            props.onChange(input.current.value)
        }, props.delay || 500)
    }

    return (
        <div className={'is-pulled-right field ' + styles.searchbox}>
            <div className="control has-icons-right">
                <input className="input is-rounded" placeholder="Search" onKeyUp={delayedOnChange} ref={input} />
                <span className="icon is-small is-right"><i className="fa fa-search"></i></span>
            </div>
        </div>
    )
}

function Customer({ name }) {
    return (<tr><td>{name}</td></tr>)
}

const mapStateToProps = ({ customers }) => ({ customers })
const actions = { fetchCustomers }
export default connect(mapStateToProps, actions)(Customers)

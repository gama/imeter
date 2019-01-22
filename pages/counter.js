import React       from 'preact'
import { connect } from 'preact-redux'
import Layout      from '../components/layout'
import Counter     from '../components/counter'

function CounterPage() {
    return (
        <Layout>
            <Counter />
        </Layout>
    )
}

export default connect()(CounterPage)

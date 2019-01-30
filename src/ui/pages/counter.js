import React       from 'preact'
import Layout      from '../components/layout'
import Counter     from '../components/counter'
import withAuth    from '../lib/with-auth.js'

function CounterPage() {
    return (
        <Layout>
            <Counter />
        </Layout>
    )
}

export default withAuth(CounterPage)

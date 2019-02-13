import React       from 'preact'
import { connect } from 'preact-redux'
import Layout      from '../components/layout'
import Counter     from '../components/counter'
import { incrementCount, decrementCount, resetCount } from '../state/actions'

function CounterPage(props) {
    return (
        <Layout>
            <Counter {...props} />
        </Layout>
    )
}

const mapStateToProps = (state) => { return { count: state.count } }
const actions = { incrementCount, decrementCount, resetCount }

export default connect(mapStateToProps, actions)(CounterPage)

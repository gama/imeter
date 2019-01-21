import { Component } from 'preact'
import { connect }   from 'preact-redux'
import Layout        from '../components/layout'
import Clock         from '../components/clock'
import { startClock, serverRenderClock } from '../store'

class ClockPage extends Component {
    static getInitialProps({ reduxStore, req }) {
        const isServer = !!req
        reduxStore.dispatch(serverRenderClock(isServer))
        return {}
    }

    componentDidMount() {
        const { dispatch } = this.props
        this.timer = startClock(dispatch)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render({ lastUpdate, light }) {
        return (
            <Layout>
                <Clock lastUpdate={lastUpdate} light={light} />
            </Layout>
        )
    }
}

function mapStateToProps (state) {
    const  { lastUpdate, light } = state
    return { lastUpdate, light }
}

export default connect(mapStateToProps)(ClockPage)

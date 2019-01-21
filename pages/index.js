import React from 'preact'
import { connect } from 'preact-redux' 
import { startClock, serverRenderCock } from '../store'
import Link from 'next/link'
import Head from '../components/head.js'
import './style.sass'

class Index extends React.Component {
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

    render() {
        return (
            <div className="next-page">
                <section className="section">
                    <Head />
                    <nav className="navbar" role="navigation" aria-label="main navigation">
                        <div className="navbar-brand">
                            <Link href="/">
                                <a className="navbar-item">
                                    <img className="logo" src="/static/kiom-small.png"></img>
                                </a>
                            </Link>
                            <span className="navbar-item">Welcome to next.js (v2)!</span>
                        </div>
                        <div className="navbar-end">
                            <Link href="/other"><a className="navbar-item">Other</a></Link>
                            <Link href="/about"><a className="navbar-item">About</a></Link>
                        </div>
                    </nav>
                </section>
                <section className="section">
                    <p>This is an initial paragraph, to help us get started with the immediate feedback thing</p>
                </section>
            </div>
        )
    }
}

export default connect()(Index)

import React       from 'preact'
import { connect } from 'preact-redux'
import Link        from 'next/link'

function Header(props) {
    return (
        <section className="section header">
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link href="/">
                        <a className="navbar-item">
                            <img className="logo" src="/static/kiom-small.png"></img>
                        </a>
                    </Link>
                    <span className="navbar-item">Welcome to next.js (v3)!</span>
                </div>
                <div className="navbar-end">
                    {(props.authToken ? loggedInLinks() : '')}
                </div>
            </nav>
        </section>
    )
}

const loggedInLinks = () => {
    return (
        <span>
            <Link href="/clock"><a className="navbar-item">Clock</a></Link>
            <Link href="/counter"><a className="navbar-item">Counter</a></Link>
            <Link href="/tv-shows"><a className="navbar-item">Tv Shows</a></Link>
            <Link href="/about"><a className="navbar-item">About</a></Link>
            <Link href="/logout"><a className="navbar-item">Logout</a></Link>
        </span>
    )
}

const mapStateToProps = (state) => {
    return { authToken: state.authToken }
}

export default connect(mapStateToProps)(Header)

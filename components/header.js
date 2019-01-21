import Link from 'next/link'

export default function() {
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
                    <Link href="/clock"><a className="navbar-item">Clock</a></Link>
                    <Link href="/counter"><a className="navbar-item">Counter</a></Link>
                    <Link href="/about"><a className="navbar-item">About</a></Link>
                </div>
            </nav>
        </section>
    )
}

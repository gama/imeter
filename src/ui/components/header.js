import React       from 'preact'
import { connect } from 'preact-redux'
import Link        from 'next/link'
import { logout }  from '../state/actions'
import style       from '../styles/header.sass'

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = { active: false }
    }

    activeClass() {
        return this.state.active ? ' is-active' : ''
    }

    onBurgerClick() {
        console.log('BURGER CLICK')
        this.setState({ active: !this.state.active })
    }

    render(props) {
        return (
            <header className={style.header}>
                <nav className="navbar has-shadow is-spaced" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                        <Link href="/">
                            <a className="navbar-item">
                                <img src="/static/ivision.png" className={style.logo} />
                            </a>
                        </Link>
                        <span className="navbar-item">
                            <h2 className={style.title}>iMETER<span className={style.subtitle}>Management Interface</span></h2>
                        </span>
                        {props.authToken && <NavbarBurger activeClass={this.activeClass()} onClick={this.onBurgerClick.bind(this)} />}
                    </div>
                    {props.authToken && <NavbarMenu activeClass={this.activeClass()} logout={props.logout} />}
                </nav>
            </header>)
    }
}

function NavbarBurger({ activeClass, onClick }) {
    return (
        <a role="button" className={'navbar-burger' + activeClass} onClick={onClick} aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    )
}

function NavbarMenu({ activeClass, logout }) {
    const logoutClicked = (logout) => (event) => {
        event.preventDefault()
        logout()
    }

    return (
        <div id="menu" className={'navbar-menu' + activeClass}>
            <div className="navbar-end">
                {/*<Link href="/clock"><a className={style.navbaritem + ' navbar-item'}>Clock</a></Link>*/}
                {/*<Link href="/counter"><a className={style.navbaritem + ' navbar-item'}>Counter</a></Link>*/}
                {/*<Link href="/tv-shows"><a className={style.navbaritem + ' navbar-item'}>Tv Shows</a></Link>*/}
                {/*<Link href="/about"><a className={style.navbaritem + ' navbar-item'}>About</a></Link>*/}
                <Link href="/meters" ><a className={style.navbaritem + ' navbar-item'}><i className="fa fa-tachometer" />Meters</a></Link>
                <Link href="/reports"><a className={style.navbaritem + ' navbar-item'}><i className="fa fa-bar-chart" />Reports</a></Link>
                <Link href="/logout" ><a className={style.navbaritem + ' navbar-item'} onClick={logoutClicked(logout)}><i className="fa fa-sign-out" /> Logout</a></Link>
            </div>
        </div>
    )
}

const mapStateToProps = ({ authToken }) => ({ authToken })
const actions = { logout }
export default connect(mapStateToProps, actions)(Header)

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

    componentWillReceiveProps(newProps) {
        document.body.classList.toggle('is-fetching', newProps.fetching)
    }

    activeClass() {
        return this.state.active ? ' is-active' : ''
    }

    onBurgerClick() {
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
                        {props.user && <NavbarBurger activeClass={this.activeClass()} onClick={this.onBurgerClick.bind(this)} />}
                    </div>
                    {props.user && <NavbarMenu activeClass={this.activeClass()} logout={props.logout} user={props.user} />}
                </nav>
            </header>
        )
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

function NavbarMenu({ activeClass, user, logout }) {
    return (
        <div id="menu" className={'navbar-menu' + activeClass}>
            <div className="navbar-end">
                {user.role === 'customer' && <MenuLink href="/meters"    icon="gauge" label="Meters" />}
                {user.role === 'customer' && <MenuLink href="/reports"   icon="chart-bar" label="Reports" />}
                {user.role === 'admin'    && <MenuLink href="/customers" icon="currency-usd" label="Customers" />}
                {user.role === 'admin'    && <MenuLink href="/users"     icon="account-multiple" label="Users" />}
                <MenuLink href="/about" icon="question" label="About" />
                {user && <UserDropdown {...{user, logout}} /> }
            </div>
        </div>
    )
}

function MenuLink({ href, icon, label }) {
    return <Link href={href} shallow={true}><a className={style.navbaritem + ' navbar-item'}><i className={'mdi mdi-' + icon} />{label}</a></Link>
}

function UserDropdown({user, logout}) {
    const logoutClicked = (event) => {
        event.preventDefault()
        logout()
    }

    return (
        <div className={style.navbaritem + ' navbar-item has-dropdown is-hoverable'}>
            <a className={style.dropdownlink + ' navbar-link is-arrowless'}><i className="mdi mdi-account-circle" /></a>

            <div className="navbar-dropdown is-right">
                <div className={style.navbaritem + ' navbar-item'}>{user.firstName}</div>
                <hr className="navbar-divider" />
                <Link href="/logout" ><a className={style.navbaritem + ' navbar-item'} onClick={logoutClicked}><i className="mdi mdi-exit-to-app" />Logout</a></Link>
            </div>
        </div>
    )
}

const mapStateToProps = ({ fetching, auth }) => ({ fetching, user: auth && auth.user })
const actions = { logout }
export default connect(mapStateToProps, actions)(Header)

import React       from 'preact'
import { connect } from 'preact-redux'
import Header      from './header'
import Footer      from './footer'
import '../styles/style.global.sass'

function Layout(props) {
    return (
        <div className="next-page main-container">
            <Header />
            <section className="section main-content">
                {props.children}
            </section>
            <Footer />
        </div>
    )
}

const mapStateToProps = (state) => {
    return { isLoggedIn: !!state.authToken }
}

export default connect(mapStateToProps)(Layout)

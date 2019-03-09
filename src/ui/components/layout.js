import React       from 'preact'
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

export default Layout

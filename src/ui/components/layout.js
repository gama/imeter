import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import Header               from './header'
import './style.global.sass'

class Layout extends Component {
    render(props) {
        return (
            <div className="next-page main-container">
                <Header />
                <section className="section main-content">
                    {props.children}
                </section>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { isLoggedIn: !!state.authToken }
}

export default connect(mapStateToProps)(Layout)

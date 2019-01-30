import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import NextHead             from 'next/head'
import Header               from './header'
import './style.global.sass'

class Layout extends Component {
    render(props) {
        return (
            <div className="next-page main-container">
                <NextHead>
                    <title>WIC - Next.JS</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </NextHead>
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

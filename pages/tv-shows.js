/* eslint-disable no-console */

import React, { Component } from 'preact'
import Link                 from 'next/link'
import fetch                from 'isomorphic-unfetch'
import { withRouter }       from 'next/router'
import Layout               from '../components/layout'

class TvShows extends Component {
    static async getInitialProps({ query }) {
        const param = query.q || 'batman'
        const res   = await fetch('https://api.tvmaze.com/search/shows?q=' + param)
        const data  = await res.json()
        console.debug(`TvShows data fetched for query "${param}"; count: ${data.length}`)

        return { shows: data }
    }

    render(props) {
        return (
            <Layout>
                <h1 className="title"></h1>
                <ul>
                    {props.shows.map(({show}) => (
                        <li key={show.id}>
                            <Link href={`/tv-show?id=${show.id}`}>
                                <a>{show.name}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Layout>
        )
    }
}

export default withRouter(TvShows)

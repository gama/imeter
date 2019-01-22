/* eslint-disable no-console */

import React, { Component } from 'preact'
import fetch                from 'isomorphic-unfetch'
import Layout               from '../components/layout'


const styles = {
    thumbnail: {
        float: 'left',
        margin: '0 10px 10px 0'
    },
    img: {
        maxHeight: '160px'
    },
    summary: {
    }
}

class TvShow extends Component {
    static async getInitialProps({ query }) {
        const res   = await fetch('https://api.tvmaze.com/shows/' + query.id)
        const data  = await res.json()
        console.log(`TvShow data fetched for id ${query.id}: ${JSON.stringify(data)}`)

        return { show: data }
    }

    render(props) {
        return (
            <Layout>
                <h1 className="title">{props.show.name}</h1>
                <div className="panel">
                    <span className="thumbnail" style={styles.thumbnail}>
                        <img src={props.show.image.medium} style={styles.img} />
                    </span>
                    <p style={styles.summary}>{props.show.summary.replace(/<[/]?p>/g, '')}</p>
                    {/*<p>{JSON.stringify(props.show)}</p>*/}
                </div>
            </Layout>
        )
    }
}

export default TvShow

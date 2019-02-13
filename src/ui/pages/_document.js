import React from 'preact'
import NextDocument, { Head, Main, NextScript } from 'next/document'

const minExtension          = process.env.NODE_ENV == 'production' ? '.min' : ''
// const bulmaStylesheet       = `https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma${minExtension}.css`
const fontAwesomeStylesheet = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome${minExtension}.css`

export default class Document extends NextDocument {
    render() {
        return (
            <html>
                <Head>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    {/*<link rel="stylesheet" type="text/css" href={bulmaStylesheet} />*/}
                    <link rel="stylesheet" type="text/css" href={fontAwesomeStylesheet} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}

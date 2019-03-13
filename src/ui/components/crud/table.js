import React  from 'preact'
import styles from '../../styles/entity-table.sass'

export default function EntityTable({ overlayed, headers, items, itemComponent }) {
    const NoItems = () => (
        <tr><td colSpan={headers.length} className={styles.noitems}>
            No items found.
        </td></tr>
    )

    return (
        <table className={'table is-striped is-fullwidth ' + (overlayed ? styles.overlayed : '')}>
            <thead>
                <tr>{headers.map((header, i) => (<th key={i}>{header}</th>))}</tr>
            </thead>
            <tbody>
                {(items.length === 0)
                    ? <NoItems />
                    : items.map(item => React.createElement(itemComponent, item))}
            </tbody>
        </table>
    )
}

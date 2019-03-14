import React      from 'preact'
import Pagination from './pagination'
import SearchBox  from './search'
import styles     from '../../styles/entity-table.sass'

export default function EntityTable(props) {
    const {
        overlayed, headers, items, itemComponent,
        pagination=true, page=1, perPage, onPaginate,
        search=true, onSearch
    } = props
    const numCols = headers.length

    return (
        <div className={styles.container}>
            <div className={styles.search_pagination_container}>
                {pagination && <Pagination onPaginate={onPaginate.bind(this)} current={page}
                    disablePrev={page === 1} disableNext={items.length < (perPage || Number.MAX_VALUE)} />}
                {search && <SearchBox onChange={onSearch.bind(this)} />}
            </div>
            <table className={'table is-striped is-fullwidth ' + (overlayed ? styles.overlayed : '')}>
                <TableHeader headers={headers} />
                <TableBody numCols={numCols} items={items} itemComponent={itemComponent} />
                <TableFooter numCols={numCols} />
            </table>
        </div>
    )
}

function TableHeader({ headers }) {
    return (
        <thead>
            <tr>
                {headers.map((header, i) => (<th key={i}>{header}</th>))}
            </tr>
        </thead>
    )
}

function TableBody({ numCols, items, itemComponent }) {
    return (
        <tbody>
            {(items.length === 0)
                ? <NoItems numCols={numCols} />
                : items.map(item => React.createElement(itemComponent, item))}
        </tbody>
    )
}

function TableFooter({ numCols }) {
    return (
        <tfoot>
            <tr>
                <td colSpan={numCols}></td>
            </tr>
        </tfoot>
    )
}

function NoItems({ numCols }) {
    return (
        <tr><td colSpan={numCols} className={styles.noitems}>
            No items found.
        </td></tr>
    )
}

import React      from 'preact'
import Pagination from './pagination'
import SearchBox  from './search'
import styles     from '../../styles/crud/table.sass'

export default function EntityTable(props) {
    const {
        overlayed, headers, items, itemComponent, pagination=true, page=1,
        perPage, onPaginate, search=true, onSearch, styles:pstyles = {}
    } = props
    const numCols    = headers.length
    const enablePrev = !overlayed && page > 1
    const enableNext = !overlayed && items.length >= (perPage || Number.MAX_VALUE)

    return (
        <div className={styles.container}>
            <div className={styles.search_pagination_container}>
                {pagination && <Pagination {...{ current: page, enablePrev, enableNext, onPaginate, onSearch }} />}
                {search && <SearchBox onChange={onSearch} />}
            </div>
            <table className={`table is-striped is-fullwidth ${overlayed ? styles.overlayed : ''} ${pstyles.table || ''}`}>
                <TableHeader headers={headers} />
                <TableBody   numCols={numCols} items={items} itemComponent={itemComponent} />
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

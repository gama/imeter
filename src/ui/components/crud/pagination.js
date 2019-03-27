import React  from 'preact'
import styles from '../../styles/crud/table.sass'

export default function Pagination({ current, onPaginate, enablePrev, enableNext }) {
    return (
        <div className={styles.pagination} role="navigation" aria-label="pagination">
            <a title="Previous page" className="button is-rounded pagination-previous" disabled={!enablePrev} onClick={() => enablePrev && onPaginate(current - 1)}>
                <i className="mdi mdi-chevron-left" />
            </a>
            <a title="Next page" className="button is-rounded pagination-next" disabled={!enableNext} onClick={() => enableNext && onPaginate(current + 1)}>
                <i className="mdi mdi-chevron-right" />
            </a>
        </div>
    )
}

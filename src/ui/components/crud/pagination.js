import React  from 'preact'
import styles from '../../styles/entity-table.sass'

export default function Pagination({ onPaginate, current, disablePrev, disableNext }) {
    return (
        <div className={styles.pagination} role="navigation" aria-label="pagination">
            <a title="Previous page" className="button is-rounded pagination-previous" disabled={disablePrev} onClick={() => onPaginate(current - 1)}>
                <i className="fa fa-chevron-left" />
            </a>
            <a title="Next page" className="button is-rounded pagination-next" disabled={disableNext} onClick={() => onPaginate(current + 1)}>
                <i className="fa fa-chevron-right" />
            </a>
        </div>
    )
}

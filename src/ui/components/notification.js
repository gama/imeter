import React                from 'preact'
import { connect }          from 'preact-redux'
import { hideNotification } from '../state/actions'
import styles               from '../styles/notification.sass'

function Notification({ category = 'info', title, message, timeout, hideNotification }) {
    if (timeout)
        setTimeout(hideNotification, timeout)

    return ((title || message) &&
        <div className={'notification-container ' + styles.notification}>
            <div className={`notification is-${category}`}>
                {title && <h3 className="subtitle">{title}</h3>}
                <button className="delete" onClick={() => hideNotification()}></button>
                {message}
            </div>
        </div>
    )
}

const stateToProps = ({ notification }) => ({ ...notification })
const actions      = { hideNotification }
export default connect(stateToProps, actions)(Notification)

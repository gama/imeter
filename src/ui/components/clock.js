import React  from 'preact'
import styles from './clock.sass'

const format = time => `${pad(time.getUTCHours())}:${pad(time.getUTCMinutes())}:${pad(time.getUTCSeconds())}`
const pad    = number => number < 10 ? `0${number}` : number

export default function Clock({ lastUpdate, light }) {
    return (
        <div className={(light ? 'light' : '') + ' ' + styles.clock}>
            {format(new Date(lastUpdate))}
        </div>
    )
}

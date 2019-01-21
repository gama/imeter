const format = time => `${pad(time.getUTCHours())}:${pad(time.getUTCMinutes())}:${pad(time.getUTCSeconds())}`
const pad    = number => number < 10 ? `0${number}` : number

export default ({ lastUpdate, light }) => {
    return (
    <div className={light ? 'light' : ''}>
        {format(new Date(lastUpdate))}
        <style jsx>{`
            div {
              padding: 15px;
              display: inline-block;
              color: #82FA58;
              font: 50px menlo, monaco, monospace;
              background-color: #000;
            }

            .light {
                background-color: #999;
            }
        `}
        </style>
    </div>
    )
}

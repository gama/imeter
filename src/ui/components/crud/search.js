import React, { Component } from 'preact'
import styles               from '../../styles/search.sass'

export default class SearchBox extends Component {
    constructor(props) {
        super(props)
        this.input = React.createRef()
        this.state = { value: '', timer: null }
    }

    delayedOnChange() {
        if (this.state.timer)
            clearTimeout(this.state.timer)

        const timer = setTimeout(() => {
            this.timer = null
            this.replaceValueAndTrigger()
        }, this.props.delay || 300)
        this.setState({ timer })
    }

    replaceValueAndTrigger() {
        const currValue = this.input.current ? this.input.current.value : null
        if (this.state.value != currValue) {
            this.setState({ value: currValue })
            this.props.onChange(currValue)
        }
    }

    render() {
        return (
            <div className={'is-pulled-right field ' + styles.searchbox}>
                <div className="control has-icons-right">
                    <input className="input is-rounded" placeholder="Search" onKeyUp={this.delayedOnChange.bind(this)} ref={this.input} />
                    <span className="icon is-small is-right"><i className="fa fa-search"></i></span>
                </div>
            </div>
        )
    }
}

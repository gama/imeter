import React, { Component } from 'preact'
import { connect }          from 'preact-redux'
import { incrementCount, decrementCount, resetCount } from '../store'

class Counter extends Component {
    increment() {
        this.props.dispatch(incrementCount())
    }

    decrement() {
        this.props.dispatch(decrementCount())
    }

    reset() {
        this.props.dispatch(resetCount())
    }

    render() {
        const { count } = this.props
        return (
            <div>
                <h1>Count: <span>{count}</span></h1>
                <button onClick={this.increment.bind(this)}>+1</button>
                <button onClick={this.decrement.bind(this)}>-1</button>
                <button onClick={this.reset.bind(this)}>Reset</button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {count: state.count}
}

export default connect(mapStateToProps)(Counter)

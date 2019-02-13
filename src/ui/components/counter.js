import React, { Component } from 'preact'

class Counter extends Component {
    render({ count, incrementCount, decrementCount, resetCount }) {
        return (
            <div>
                <h1>Count: <span>{count}</span></h1>
                <button onClick={incrementCount}>+1</button>
                <button onClick={decrementCount}>-1</button>
                <button onClick={resetCount}>Reset</button>
            </div>
        )
    }
}

export default Counter

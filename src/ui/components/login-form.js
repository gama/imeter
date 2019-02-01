import React from 'preact'

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.username   = React.createRef()
        this.password   = React.createRef()
        this.rememberMe = React.createRef()
    }

    onSubmit() {
        // console.log('username: ',   this.username.current.value)
        // console.log('password: ',   this.password.current.value)
        // console.log('rememberMe: ', this.rememberMe.current.checked)
        this.props.onSubmit(
            this.username.current.value,
            this.password.current.value,
            this.rememberMe.current.checked
        )
    }

    render() {
        return (
            <div>
                <UsernameInput refp={this.username} />
                <PasswordInput refp={this.password} />
                <div style={style.columns}>
                    <RememberMeCheckbox refp={this.rememberMe} />
                    <SubmitButton onSubmit={this.onSubmit.bind(this)} />
                </div>
            </div>
        )
    }
}

function UsernameInput(props) {
    return (
        <div className="field">
            <label htmlFor="username" className="label">Username</label>
            <div className="control has-icons-left">
                <input name="username" type="input" className="input" ref={props.refp} />
                <span className="icon is-small is-left">
                    <i className="fa fa-user"></i>
                </span>
            </div>
        </div>
    )
}

function PasswordInput(props) {
    return (
        <div className="field">
            <label htmlFor="password" className="label">Password</label>
            <div className="control has-icons-left">
                <input name="password" type="password" className="input" ref={props.refp} />
                <span className="icon is-left"><i className="fa fa-lock"></i></span>
            </div>
        </div>
    )
}

function RememberMeCheckbox(props) {
    return (
        <div className="field">
            <div className="control">
                <input name="remember-me" type="checkbox" ref={props.refp} />
                <label htmlFor="remember-me" className="checkbox">&nbsp; Remember Me</label>
            </div>
        </div>
    )
}

function SubmitButton(props) {
    return (
        <div className="field">
            <div className="control">
                <button name="submit" className="button is-link" onClick={props.onSubmit}>
                    <span className="icon is-left">
                        <i className="fa fa-check"></i>
                    </span>
                    <span>Submit</span>
                </button>
            </div>
        </div>
    )
}

const style = {
    columns: {
        'display': 'flex',
        'justify-content': 'space-between',
        'margin-top': '30px'
    }
}

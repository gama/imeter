import React from 'preact'
import style from '../styles/login-form.sass'

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.email      = React.createRef()
        this.password   = React.createRef()
        this.rememberMe = React.createRef()
    }

    componentDidMount() {
        console.log('COMPONENT DID MOUNT')
        this.password.current.value = ''
    }

    onSubmit(event) {
        event.preventDefault()
        this.props.onSubmit(
            this.email.current.value,
            this.password.current.value,
            this.rememberMe.current.checked
        )
    }

    render(props) {
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <EmailInput refp={this.email} />
                <PasswordInput refp={this.password} />
                <div className={style.columns}>
                    <RememberMeCheckbox refp={this.rememberMe} />
                    <SubmitButton onSubmit={this.onSubmit.bind(this)} />
                </div>
                {props.error && <ErrorMessage error={props.error} />}
            </form>
        )
    }
}

function EmailInput(props) {
    return (
        <div className="field">
            <label htmlFor="email" className="label">Email</label>
            <div className="control has-icons-left">
                <input name="email" type="input" className="input" ref={props.refp} />
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
                <input id="remember-me" name="remember-me" type="checkbox" ref={props.refp} />
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

function ErrorMessage(props) {
    return (
        <div className="field">
            <div className="control">
                <div className={style.error}>{props.error.error}</div>
            </div>
        </div>
    )
}

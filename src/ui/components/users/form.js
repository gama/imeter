import React                   from 'preact'
import { capitalize }          from 'lodash'
import { Card, Field, Select } from '../crud/form'
import styles                  from '../../styles/users/form.sass'

export default function UserForm({ id, firstName, lastName, email, role, onSave}) {
    const firstNameRef = React.createRef()
    const lastNameRef  = React.createRef()
    const emailRef     = React.createRef()
    const passwordRef  = React.createRef()
    const roleRef      = React.createRef()
    const refs         = {firstNameRef, lastNameRef, emailRef, passwordRef, roleRef}
    const refValues    = () => (
        Object.entries(refs).reduce((hash, [name, ref]) => (
            (hash[name.slice(0, -3)] = ref.current.value, hash)
        ), {})
    )

    return (
        <div className="column is-two-fifths">
            <Card name="user" url="/users" id={id} styles={styles} mode="edit" onSave={() => onSave({...refValues(refs), id})}>
                <Field name="firstName" label="First Name">
                    <input ref={firstNameRef} name="firstName" value={firstName} className="input is-fullwidth" />
                </Field>
                <Field name="lastName" label="Last Name">
                    <input ref={lastNameRef} name="lastName" value={lastName} className="input is-fullwidth" />
                </Field>
                <Field name="email" label="Email">
                    <input ref={emailRef} name="email" value={email} className="input is-fullwidth" />
                </Field>
                <Field name="password" label="Password">
                    <input ref={passwordRef} type="password" name="password" value="" className="input is-fullwidth" />
                </Field>
                <Field name="role" label="Role">
                    <Select refp={roleRef} name="role" selected={role} options={['admin', 'customer', 'operator'].map(o => ({value: o, label: capitalize(o)}))} />
                </Field>
            </Card>
        </div>
    )
}

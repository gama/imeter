import React           from 'preact'
import { Card, Field } from '../crud/form'
import styles          from '../../styles/users/form.sass'

export default function UserDetails({ id, firstName, lastName, email, role, onDelete }) {
    return (
        <div className="column is-two-fifths">
            <Card name="user" url="/users" id={id} mode="view" styles={styles}
                title={`User ${id} \u00A0|\u00A0 ${role}`} onDelete={() => onDelete(id)}>

                <Field name="name" label="Name">
                    <div className="control">{firstName} {lastName}</div>
                </Field>
                <Field name="name" label="Email">
                    <div className="control">{email}</div>
                </Field>
            </Card>
        </div>
    )
}

import React           from 'preact'
import { Card, Field } from '../crud/form'
import styles          from '../../styles/users/form.sass'
import { capitalize }  from 'lodash'

export default function UserDetails(props) {
    const { id='', firstName='', lastName='', email='', role='', onDelete } = props
    return (
        <Card name="user" url="/users" id={id} mode="view" styles={styles}
            title={`User ${id} \u00A0|\u00A0 ${capitalize(role)}`} onDelete={() => onDelete(id)}>

            <Field name="name" label="Name">
                <div className="control">{firstName} {lastName}</div>
            </Field>
            <Field name="name" label="Email">
                <div className="control">{email}</div>
            </Field>
        </Card>
    )
}

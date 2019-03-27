import React          from 'preact'
import Link           from 'next/link'
import EntityTable    from '../crud/table'
import { capitalize } from 'lodash'
import styles         from '../../styles/users/table.sass'

export default function UsersTable({ fetching, users, page, perPage, onPaginate, onSearch }) {
    return <span>
        <EntityTable overlayed={fetching === 'users'} headers={['Name', 'Email', 'Role']}
            items={users} itemComponent={Row} {...{ page, perPage, onPaginate, onSearch, styles }} />
        <NewButton />
    </span>
}

const Row = ({ id, firstName, lastName, email, role }) => (
    <Link href={`/users?id=${id}`} as={`/users/${id}`} shallow={true}>
        <tr className='is-link'>
            <td>{`${firstName} ${lastName}`}</td>
            <td>{email}</td>
            <td>{capitalize(role)}</td>
        </tr>
    </Link>
)

const NewButton = () => (
    <Link href="/users?action=new" as="/users/new" shallow={true}>
        <a className="button is-primary">
            <span className="icon is-small is-pulled-right"><i className="mdi mdi-plus"></i></span> <span>New User</span>
        </a>
    </Link>
)

import React          from 'preact'
import Link           from 'next/link'
import Router         from 'next/router'
import { capitalize } from 'lodash'
import styles         from '../../styles/crud/form.sass'

export const Card = (props) => {
    const buttons = props.buttons || defaultButtons(props)

    return (
        <div className="card">
            <header className={`card-header ${styles.header} ${props.styles.header}`}>
                <p className="card-header-title">{cardTitle(props)}</p>
                <HeaderActions buttons={buttons} {...props} />
            </header>
            <div className="card-content">
                <div className={`content ${styles.content} ${props.styles.content}`}>
                    {props.children}
                </div>
            </div>
            <footer className={`card-footer ${styles.footer} ${props.styles.footer}`}>
                <FooterActions buttons={buttons} {...props} />
            </footer>
        </div>
    )
}

export const EditButton = ({ id, url }) => (
    <Link href={`${url}?id=${id}&action=edit`} as={`${url}/${id}/edit`} shallow={true}>
        <a aria-label="edit">
            <span className="icon">
                <i className="mdi mdi-square-edit-outline" aria-hidden="true"></i>
            </span>
        </a>
    </Link>
)

export const DeleteButton = ({ onDelete }) => (
    <a aria-label="edit" onClick={onDelete}>
        <span className="icon">
            <i className="mdi mdi-delete-outline" aria-hidden="true"></i>
        </span>
    </a>
)

export const CloseButton = ({ url }) => (
    <Link href={url} shallow={true}>
        <a aria-label="close">
            <span className="icon">
                <i className="mdi mdi-close" aria-hidden="true"></i>
            </span>
        </a>
    </Link>
)

export const CancelButton = ({ onCancel }) => (
    <a className="button is-fullwidth" aria-label="close" onClick={onCancel || (() => Router.back())}>
        <span className="icon">
            <i className="mdi mdi-cancel" aria-hidden="true"></i>
        </span>
        <span>Cancel</span>
    </a>
)

export const SaveButton = ({ onSave }) => (
    <a className="button is-primary is-fullwidth" ria-label="close" onClick={onSave}>
        <span className="icon">
            <i className="mdi mdi-check" aria-hidden="true"></i>
        </span>
        <span>Save</span>
    </a>
)

export const Field = (props) => (
    <div className="field is-horizontal has-addons">
        <div className="field-label">
            <label htmlFor={props.name} className="label">{props.label}</label>
        </div>
        <div className="field-body">
            <div className="field">
                <div className="control is-expanded">
                    {props.children}
                </div>
            </div>
        </div>
    </div>
)

export const Select = (props) => (
    <div className="select is-fullwidth">
        <select name="role" ref={props.refp}>
            <option disabled selected={!props.selected}></option>
            {props.options.map((o) => (
                <option key={o.value} value={o.value} selected={o.value === props.selected}>{o.label}</option>
            ))}
        </select>
    </div>
)

const cardTitle = (props) => (
    props.title || ((!props.id ? 'New ' : '') + capitalize(props.name) + (props.id ? ` ${props.id}` : ''))
)

const defaultButtons = (props) => (
    {view: 'edit delete close', edit: 'close cancel save'}[props.mode]
)

const HeaderActions = (props) => (
    (!props.buttons.match(/edit|delete|close/)) ? '' :
        <div className="card-header-icon">
            {props.buttons.includes('edit')   && <EditButton   {...props} />}
            {props.buttons.includes('delete') && <DeleteButton {...props} />}
            {props.buttons.includes('close')  && <CloseButton  {...props} />}
        </div>
)

const FooterActions = (props) => (
    (!props.buttons.match(/cancel|save/)) ? '' :
        <div className="card-footer-item">
            {props.buttons.includes('cancel') && <CancelButton {...props} />}
            {props.buttons.includes('save')   && <SaveButton   {...props} />}
        </div>
)

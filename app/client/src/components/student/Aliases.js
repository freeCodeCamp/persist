import React, { Component } from 'react';
import { Accordion, Panel, Table } from 'react-bootstrap';
import { IconButton, FloatingActionButton, Dialog, FlatButton } from 'material-ui';
import { submit } from 'redux-form';
import { saveAlias, deleteAlias } from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import AliasEditor from './AliasEditor';
import { EditorModeEdit, ContentDeleteSweep, ContentAdd } from 'material-ui/svg-icons';

class Aliases extends Component {
    constructor(props) {
        super(props);
        this.osis = this.props.osis;
        this.alias = {};
        this.state = {
            open: {
                edit: false,
                delete: false
            }
        };
    }

    renderAliases() {
        const { initValue } = this.props;
        const aliasesHTML = initValue.map((alias, index) => {
            const {
                firstName,
                middleName,
                lastName,
                suffix
            } = alias;
            return (
                <tr key={index}>
                    <td>{firstName}</td>
                    <td>{middleName}</td>
                    <td>{lastName}</td>
                    <td>{suffix}</td>
                    <td>
                        <IconButton onClick={() => this.handleEdit(alias)}>
                            <EditorModeEdit />
                        </IconButton>
                        <IconButton onClick={() => this.handleDelete(alias)}>
                            <ContentDeleteSweep />
                        </IconButton>
                    </td>
                </tr>
            );
        });
        return (
            <tbody>
                {aliasesHTML}
            </tbody>
        );
    }

    handleDelete(alias) {
        this.alias = alias;
        this.setState({
            open: {
                ...this.state.open,
                delete: true
            }
        });
    }

    deleteAlias() {
        this.props.deleteAlias(this.osis, this.alias._id).then(() => this.handleClose());
    }

    handleEdit(alias) {
        this.alias = alias;
        this.setState({
            open: {
                ...this.state.open,
                edit: true
            }
        });
    }

    saveAlias(oldAlias, newAlias) {
        let alias;
        alias = newAlias;
        if (oldAlias._id) {
            alias = merge(oldAlias, newAlias);
        }
        alias.osis = this.osis;
        this.props.saveAlias(alias).then(() => this.handleClose());
    }

    handleSave() {
        this.props.submit('AliasEditor');
    }

    handleClose() {
        this.setState({
            open: {
                delete: false,
                edit: false
            }
        });
    }

    renderDeleteDialog() {
        const { spinner } = this.props;
        const open = this.state.open.delete;
        const actions = [
            <FlatButton label="Cancel" disabled={spinner} primary={true} keyboardFocused={true} onTouchTap={() => this.handleClose()} />,
            <FlatButton label="Delete" disabled={spinner} primary={true} onTouchTap={() => this.deleteAlias()} />
        ];
        return (
            <Dialog actions={actions} open={open}>
                Delete Alias?
            </Dialog>
        );
    }

    renderEditDialog() {
        const { spinner } = this.props;
        const alias = this.alias;
        const open = this.state.open.edit;
        const actions = [
            <FlatButton label="Cancel" disabled={spinner} primary={true} onTouchTap={() => this.handleClose()} />,
            <FlatButton label="Save" disabled={spinner} primary={true} keyboardFocused={true} onTouchTap={() => this.handleSave()} />
        ];
        const title = isEmpty(alias) ? 'Add new Alias' : 'Edit Alias';
        const oldAlias = cloneDeep(alias);
        return (
            <Dialog actions={actions} autoScrollBodyContent={true} open={open} title={title}>
                <AliasEditor initialValues={alias} onSubmit={this.saveAlias.bind(this, oldAlias)} />
            </Dialog>
        );
    }

    render() {
        const { fields } = this.props;

        const tableHead = (
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Middle Name</th>
                    <th>Last Name</th>
                    <th>Suffix</th>
                    <th>Actions</th>
                </tr>
            </thead>
        );
        return (
            <Accordion>
                <Panel header="Aliases" eventKey="1">
                    {fields.length > 0
                        ? <Table responsive condensed>
                              {tableHead}
                              {this.renderAliases()}
                          </Table>
                        : null}
                    <FloatingActionButton mini={true} onClick={() => this.handleEdit({})}>
                        <ContentAdd />
                    </FloatingActionButton>
                    {this.renderEditDialog()}
                    {this.renderDeleteDialog()}
                </Panel>
            </Accordion>
        );
    }
}

const mapStateToProps = state => ({
    spinner: state.spinner.page,
    auth: state.auth
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            saveAlias,
            deleteAlias,
            submit
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Aliases);

import React, { Component } from 'react';
import { Accordion, Panel, Table } from 'react-bootstrap';
import { IconButton, FloatingActionButton, Dialog, FlatButton } from 'material-ui';
import { submit } from 'redux-form';
import { saveTerm, deleteTerm } from '../../actions';
import { mapping } from '../../../../common/constants';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import TermEditor from './TermEditor';
import { EditorModeEdit, ContentDeleteSweep, ContentAdd } from 'material-ui/svg-icons';

class Terms extends Component {
    constructor(props) {
        super(props);
        this.osis = this.props.osis;
        this.term = {};
        this.state = {
            open: {
                edit: false,
                delete: false
            }
        };
    }

    renderTerms() {
        const { initValue, collegeObj } = this.props;
        const termsHTML = initValue.map((term, index) => {
            const college = collegeObj[term.college];
            const { name, status, recordType, gpa, graduationType } = term;
            return (
                <tr key={index}>
                    <td>{college.fullName}</td>
                    <td>{name}</td>
                    <td>{mapping.termStatus[status] || 'Unknown if Full or Part-time'}</td>
                    <td>{gpa}</td>
                    <td>{recordType}</td>
                    <td>{graduationType}</td>
                    <td>
                        <IconButton onClick={() => this.handleEdit(term)}>
                            <EditorModeEdit />
                        </IconButton>
                        <IconButton onClick={() => this.handleDelete(term)}>
                            <ContentDeleteSweep />
                        </IconButton>
                    </td>
                </tr>
            );
        });
        return <tbody>{termsHTML}</tbody>;
    }

    handleDelete(term) {
        this.term = term;
        this.setState({
            open: {
                ...this.state.open,
                delete: true
            }
        });
    }

    deleteTerm() {
        this.props.deleteTerm(this.osis, this.term._id).then(() => this.handleClose());
    }

    handleEdit(term) {
        this.term = term;
        this.setState({
            open: {
                ...this.state.open,
                edit: true
            }
        });
    }

    saveTerm(oldTerm, newTerm) {
        const { termForm } = this.props;
        if (!isEmpty(termForm.syncErrors)) {
            console.log(termForm);
            return;
        }
        const term = newTerm;
        term.osis = this.osis;
        this.props.saveTerm(term).then(() => this.handleClose());
    }

    handleSave() {
        this.props.submit('TermEditor');
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
            <FlatButton label="Delete" disabled={spinner} primary={true} onTouchTap={() => this.deleteTerm()} />
        ];
        return (
            <Dialog actions={actions} open={open}>
                Delete Case Note?
            </Dialog>
        );
    }

    renderEditDialog() {
        const { spinner } = this.props;
        const term = this.term;
        const open = this.state.open.edit;
        const actions = [
            <FlatButton label="Cancel" disabled={spinner} primary={true} onTouchTap={() => this.handleClose()} />,
            <FlatButton label="Save" disabled={spinner} primary={true} keyboardFocused={true} onTouchTap={() => this.handleSave()} />
        ];
        const title = isEmpty(term) ? 'Add new Term' : 'Edit Term';
        const oldTerm = cloneDeep(term);
        return (
            <Dialog actions={actions} autoScrollBodyContent={true} open={open} title={title}>
                <TermEditor initialValues={term} onSubmit={this.saveTerm.bind(this, oldTerm)} />
            </Dialog>
        );
    }

    render() {
        const { fields } = this.props;

        const tableHead = (
            <thead>
                <tr>
                    <th>College</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Term GPA</th>
                    <th>Record Type</th>
                    <th>Graduation Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
        );
        return (
            <Accordion>
                <Panel header="Terms" eventKey="1">
                    {fields.length > 0 ? (
                        <Table responsive condensed>
                            {tableHead}
                            {this.renderTerms()}
                        </Table>
                    ) : null}
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
    auth: state.auth,
    collegeObj: state.colleges.idObj,
    termForm: state.form['TermEditor']
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            saveTerm,
            deleteTerm,
            submit
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Terms);

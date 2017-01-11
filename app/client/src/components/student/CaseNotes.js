import React, {Component} from 'react';
import {Accordion, Panel, Table} from 'react-bootstrap';
import {IconButton, FloatingActionButton, Dialog, FlatButton} from 'material-ui';
import {submit} from 'redux-form';
import moment from 'moment';
import {saveCaseNote, deleteCaseNote, addReminder, removeReminder} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import CaseNoteEditor from './CaseNoteEditor';
import {EditorModeEdit, ContentDeleteSweep, ContentAdd} from 'material-ui/svg-icons';

class CaseNotes extends Component {
    constructor(props) {
        super(props);
        this.osis = this.props.osis;
        this.caseNote = {};
        this.state = {
            open: {
                edit: false,
                delete: false
            }
        };
    }

    renderCaseNotes() {
        const {initValue, usersObj} = this.props;
        const caseNotesHTML = initValue.map((caseNote, index) => {
            const {profile: {firstName, lastName}} = usersObj[caseNote.user];
            const {
                date,
                description,
                communicationType,
                needFollowUp,
                issueResolved
            } = caseNote;
            const fullName = `${firstName} ${lastName}`.trim();
            return (
                <tr key={index}>
                    <td>{moment(date).format('ll')}</td>
                    <td>{description}</td>
                    <td>{communicationType}</td>
                    <td>{fullName}</td>
                    <td>{needFollowUp ? 'Yes' : 'No'}</td>
                    <td>{issueResolved ? 'Yes' : ''}</td>
                    <td>
                        <IconButton onClick={() => this.handleEdit(caseNote)}>
                            <EditorModeEdit />
                        </IconButton>
                        <IconButton onClick={() => this.handleDelete(caseNote)}>
                            <ContentDeleteSweep/>
                        </IconButton>
                    </td>
                </tr>
            )
        });
        return (
            <tbody>
            {caseNotesHTML}
            </tbody>
        );
    }

    handleDelete(caseNote) {
        this.caseNote = caseNote;
        this.setState({
            open: {
                ...this.state.open,
                delete: true
            }
        });
    }

    deleteCaseNote() {
        this.props.deleteCaseNote(this.osis, this.caseNote._id)
            .then(() => (this.handleClose()));
    }

    handleEdit(caseNote) {
        this.caseNote = caseNote;
        this.setState({
            open: {
                ...this.state.open,
                edit: true
            }
        });
    }

    saveCaseNote(oldCaseNote, newCaseNote) {
        const {auth: {user}} = this.props;
        let caseNote;
        caseNote = newCaseNote;
        if (oldCaseNote._id) {
            caseNote = merge(oldCaseNote, newCaseNote);
        }
        caseNote.osis = this.osis;
        caseNote.user = user._id;
        caseNote.date = new Date();
        this.props.saveCaseNote(caseNote)
            .then(() => {
                this.handleClose();
                if (caseNote.needFollowUp && !caseNote.issueResolved) {
                    this.props.addReminder(caseNote);
                } else if (caseNote.issueResolved) {
                    this.props.removeReminder(caseNote._id);
                }
            });
    }

    handleSave() {
        this.props.submit('CaseNoteEditor');
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
        const {spinner} = this.props;
        const open = this.state.open.delete;
        const actions = [
            <FlatButton
                label="Cancel"
                disabled={spinner}
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleClose()}
            />,
            <FlatButton
                label="Delete"
                disabled={spinner}
                primary={true}
                onTouchTap={() => this.deleteCaseNote()}
            />
        ];
        return (
            <Dialog actions={actions} open={open}>
                Delete Case Note?
            </Dialog>
        );
    }

    renderEditDialog() {
        const {spinner} = this.props;
        const caseNote = this.caseNote;
        const open = this.state.open.edit;
        const actions = [
            <FlatButton
                label="Cancel"
                disabled={spinner}
                primary={true}
                onTouchTap={() => this.handleClose()}
            />,
            <FlatButton
                label="Save"
                disabled={spinner}
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleSave()}
            />
        ];
        const title = isEmpty(caseNote) ? 'Add new Case Note' : 'Edit CaseNote';
        const oldCaseNote = cloneDeep(caseNote);
        return (
            <Dialog actions={actions} open={open} title={title}>
                <CaseNoteEditor initialValues={caseNote} onSubmit={this.saveCaseNote.bind(this, oldCaseNote)}/>
            </Dialog>
        );
    }

    render() {
        const {fields} = this.props;

        const tableHead = (
            <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Communication Type</th>
                <th>Counselor</th>
                <th>Needs Follow Up</th>
                <th>Issue Resolved</th>
                <th>Actions</th>
            </tr>
            </thead>
        );
        return (
            <Accordion>
                <Panel header='Case Notes' eventKey='1'>
                    {fields.length > 0 ?
                        <Table responsive condensed>
                            {tableHead}
                            {this.renderCaseNotes()}
                        </Table> : null
                    }
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

const mapStateToProps = (state) => ({
    spinner: state.spinner,
    auth: state.auth,
    usersObj: state.counselors.idObj
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        saveCaseNote,
        deleteCaseNote,
        addReminder,
        removeReminder,
        submit
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(CaseNotes);

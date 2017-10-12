import React, { Component } from 'react';
import { Accordion, Panel, Table } from 'react-bootstrap';
import { IconButton, FloatingActionButton, Dialog, FlatButton } from 'material-ui';
import { submit } from 'redux-form';
import { saveApplication, deleteApplication } from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get, isEmpty, merge, cloneDeep } from 'lodash';
import ApplicationEditor from './ApplicationEditor';
import { EditorModeEdit, ContentDeleteSweep, ContentAdd } from 'material-ui/svg-icons';

class Applications extends Component {
    constructor(props) {
        super(props);
        this.osis = this.props.osis;
        this.application = {};
        this.state = {
            open: {
                edit: false,
                delete: false
            }
        };
    }

    renderApplications() {
        const { initValue, collegeObj } = this.props;
        const applicationsHTML = initValue.map((application, index) => {
            const college = collegeObj[application.college];
            const { type, result, heop, attending, defer, notes } = application;
            return (
                <tr key={index}>
                    <td>{get(college, 'fullName')}</td>
                    <td>{type}</td>
                    <td>{result}</td>
                    <td>{heop}</td>
                    <td>{attending ? 'Yes' : 'No'}</td>
                    <td>{defer ? 'Yes' : 'No'}</td>
                    <td>{notes}</td>
                    <td>
                        <IconButton onClick={() => this.handleEdit(application)}>
                            <EditorModeEdit />
                        </IconButton>
                        <IconButton onClick={() => this.handleDelete(application)}>
                            <ContentDeleteSweep />
                        </IconButton>
                    </td>
                </tr>
            );
        });
        return <tbody>{applicationsHTML}</tbody>;
    }

    handleDelete(application) {
        this.application = application;
        this.setState({
            open: {
                ...this.state.open,
                delete: true
            }
        });
    }

    deleteApplication() {
        this.props.deleteApplication(this.osis, this.application._id).then(() => this.handleClose());
    }

    handleEdit(application) {
        this.application = application;
        this.setState({
            open: {
                ...this.state.open,
                edit: true
            }
        });
    }

    saveApplication(oldApplication, newApplication) {
        let application;
        application = newApplication;
        if (oldApplication._id) {
            application = merge(oldApplication, newApplication);
        }
        application.osis = this.osis;
        this.props.saveApplication(application).then(() => this.handleClose());
    }

    handleSave() {
        this.props.submit('ApplicationEditor');
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
            <FlatButton label="Delete" disabled={spinner} primary={true} onTouchTap={() => this.deleteApplication()} />
        ];
        return (
            <Dialog actions={actions} open={open}>
                Delete Case Note?
            </Dialog>
        );
    }

    renderEditDialog() {
        const { spinner } = this.props;
        const application = this.application;
        const open = this.state.open.edit;
        const actions = [
            <FlatButton label="Cancel" disabled={spinner} primary={true} onTouchTap={() => this.handleClose()} />,
            <FlatButton label="Save" disabled={spinner} primary={true} keyboardFocused={true} onTouchTap={() => this.handleSave()} />
        ];
        const title = isEmpty(application) ? 'Add new Case Note' : 'Edit Application';
        const oldApplication = cloneDeep(application);
        return (
            <Dialog actions={actions} autoScrollBodyContent={true} open={open} title={title}>
                <ApplicationEditor initialValues={application} onSubmit={this.saveApplication.bind(this, oldApplication)} />
            </Dialog>
        );
    }

    render() {
        const { fields } = this.props;

        const tableHead = (
            <thead>
                <tr>
                    <th>College</th>
                    <th>Type</th>
                    <th>Result</th>
                    <th>HEOP/EOP</th>
                    <th>Attending</th>
                    <th>Defer</th>
                    <th>Notes</th>
                    <th>Actions</th>
                </tr>
            </thead>
        );
        return (
            <Accordion>
                <Panel header="Applications" eventKey="1">
                    {fields.length > 0 ? (
                        <Table responsive condensed>
                            {tableHead}
                            {this.renderApplications()}
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
    collegeObj: state.colleges.idObj
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            saveApplication,
            deleteApplication,
            submit
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Applications);

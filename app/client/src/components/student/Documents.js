import React, { Component } from 'react';
import { Accordion, Panel, Table } from 'react-bootstrap';
import { IconButton, FloatingActionButton, Dialog, FlatButton } from 'material-ui';
import { submit } from 'redux-form';
import { saveDocument, deleteDocument } from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import DocumentEditor from './DocumentEditor';
import { EditorModeEdit, ContentDeleteSweep, FileFileDownload, ContentAdd } from 'material-ui/svg-icons';

class Documents extends Component {
    constructor(props) {
        super(props);
        this.osis = this.props.osis;
        this.document = {};
        this.state = {
            open: {
                edit: false,
                delete: false
            }
        };
    }

    renderDocuments() {
        const { initValue } = this.props;
        const documentsHTML = initValue.map((document, index) => {
            return (
                <tr key={index}>
                    <td>{document.name}</td>
                    <td>{document.type}</td>
                    <td>
                        <IconButton onClick={() => this.handleEdit(document)}>
                            <EditorModeEdit />
                        </IconButton>
                        <IconButton href={document.downloadLink}>
                            <FileFileDownload />
                        </IconButton>
                        <IconButton onClick={() => this.handleDelete(document)}>
                            <ContentDeleteSweep />
                        </IconButton>
                    </td>
                </tr>
            );
        });
        return <tbody>{documentsHTML}</tbody>;
    }

    handleDelete(document) {
        this.document = document;
        this.setState({
            open: {
                ...this.state.open,
                delete: true
            }
        });
    }

    deleteDocument() {
        this.props.deleteDocument(this.document, this.osis).then(() => this.handleClose());
    }

    handleEdit(document) {
        this.document = document;
        this.setState({
            open: {
                ...this.state.open,
                edit: true
            }
        });
    }

    saveDocument(oldDocument, newDocument) {
        this.props.saveDocument(oldDocument, newDocument, this.osis).then(() => this.handleClose());
    }

    handleSave() {
        this.props.submit('DocumentEditor');
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
            <FlatButton label="Delete" disabled={spinner} primary={true} onTouchTap={() => this.deleteDocument()} />
        ];
        return (
            <Dialog actions={actions} open={open}>
                Delete Document?
            </Dialog>
        );
    }

    renderEditDialog() {
        const { spinner } = this.props;
        const document = this.document;
        const open = this.state.open.edit;
        const actions = [
            <FlatButton label="Cancel" disabled={spinner} primary={true} onTouchTap={() => this.handleClose()} />,
            <FlatButton label="Save" disabled={spinner} primary={true} keyboardFocused={true} onTouchTap={() => this.handleSave()} />
        ];
        const title = isEmpty(document) ? 'Add new document' : 'Edit Document';
        const oldDocument = cloneDeep(document);
        return (
            <Dialog actions={actions} open={open} title={title}>
                <DocumentEditor initialValues={document} onSubmit={this.saveDocument.bind(this, oldDocument)} />
            </Dialog>
        );
    }

    render() {
        const { fields } = this.props;

        const tableHead = (
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
        );
        return (
            <Accordion>
                <Panel header="Documents" eventKey="1">
                    {fields.length > 0 ? (
                        <Table responsive condensed>
                            {tableHead}
                            {this.renderDocuments()}
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
    spinner: state.spinner.page
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            saveDocument,
            deleteDocument,
            submit
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Documents);

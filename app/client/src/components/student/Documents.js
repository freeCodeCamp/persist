import React, {Component} from 'react';
import {Accordion, Panel, Table} from 'react-bootstrap';
import {IconButton, FloatingActionButton, Dialog, FlatButton} from 'material-ui';
import {submit} from 'redux-form';
import {saveDocument} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import DocumentEditor from './DocumentEditor';
import {EditorModeEdit, FileFileDownload, ContentAdd} from 'material-ui/svg-icons';
// import aws from 'aws-sdk';

class Documents extends Component {
    constructor(props) {
        super(props);
        this.osis = this.props.osis;
        this.document = {};
        this.state = {
            open: false
        };
    }

    renderDocuments() {
        const {initValue} = this.props;
        const documentsHTML = initValue.map((document, index) => {
            return (
                <tr key={index}>
                    <td>{document.type}</td>
                    <td>{document.name}</td>
                    <td>
                        <IconButton onClick={() => this.handleEdit(document)}>
                            <EditorModeEdit />
                        </IconButton>
                        <IconButton>
                            <FileFileDownload/>
                        </IconButton>
                    </td>
                </tr>
            )
        });
        return (
            <tbody>
            {documentsHTML}
            </tbody>
        );
    }

    handleEdit(document) {
        this.document = document;
        this.setState({
            open: true
        });
    }

    saveDocument(oldDocument, newDocument) {
        this.props.saveDocument(oldDocument, newDocument, this.osis)
            .then(() => (
                this.setState({
                    open: false
                })
            ));
    }

    handleSave() {
        this.props.submit('DocumentEditor');
    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    renderEditDialog() {
        const document = this.document;
        const {open} = this.state;
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={() => this.handleClose()}
            />,
            <FlatButton
                label="Save"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleSave()}
            />
        ];
        const title = isEmpty(document) ? 'Add new document' : 'Edit Document';
        const oldDocument = cloneDeep(document);
        return (
            <Dialog actions={actions} open={open} title={title}>
                <DocumentEditor initialValues={document} onSubmit={this.saveDocument.bind(this, oldDocument)}/>
            </Dialog>
        );
    }

    render() {
        const {fields} = this.props;

        const tableHead = (
            <thead>
            <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Actions</th>
            </tr>
            </thead>
        );
        return (
            <Accordion>
                <Panel header='Documents' eventKey='1'>
                    {fields.length > 0 ?
                        <Table responsive condensed>
                            {tableHead}
                            {this.renderDocuments()}
                        </Table> : null
                    }
                    <FloatingActionButton mini={true} onClick={() => this.handleEdit({})}>
                        <ContentAdd />
                    </FloatingActionButton>
                    {this.renderEditDialog()}
                </Panel>
            </Accordion>
        );
    }
}

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        saveDocument,
        submit
    }, dispatch)
);

export default connect(null, mapDispatchToProps)(Documents);

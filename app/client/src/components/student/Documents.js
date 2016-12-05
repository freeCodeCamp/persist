import React, {Component} from 'react';
import {Accordion, Panel, Table} from 'react-bootstrap';
import {IconButton, Dialog} from 'material-ui';
import {EditorModeEdit, FileFileDownload} from 'material-ui/svg-icons';
// import aws from 'aws-sdk';

class Documents extends Component {
    constructor(props) {
        super(props);
    }

    renderDocuments() {
        const {documents} = this.props;
        const documentsHTML = documents.map(document => {
            return (
                <tr key={document._id}>
                    <td>{document.type}</td>
                    <td>{document.name}</td>
                    <td>
                        <IconButton>
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

    renderEditDialog() {
        <Dialog title='Add a new document'>
        </Dialog>
    }

    render() {
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
                    <Table responsive condensed>
                        {tableHead}
                        {this.renderDocuments()}
                    </Table>
                </Panel>
            </Accordion>
        );
    }
}

export default Documents;

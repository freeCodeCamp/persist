import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as uploadFile from '../../actions/uploadFile';
import Spinner from '../helpers/loadingScreen';
import { Button, Input, InputGroup } from 'react-bootstrap';

class UploadUI extends Component {
    constructor(props) {
        super(props);
    }

    addFile(e) {
        const files = e.target.files;
        this.setState({
            files: files
        });
    }

    addItem() {
        this.props.uploadFile(this.props.url, this.state.files[0]);
    }

    render() {
        return (
            <div>
                <h1>Upload {this.props.type}</h1>
                <p>
                    {JSON.stringify(this.props.url)}
                </p>
                <InputGroup>
                    <Input className="btn" type="file" name="photo" onChange={this.addFile.bind(this)} />
                </InputGroup>
                <Button onClick={this.addItem.bind(this)}>
                    Submit
                </Button>
                <Spinner />
                {this.props.upload.error
                    ? <p>
                          Error Found
                      </p>
                    : null}
                {this.props.upload.success
                    ? <p>
                          {this.props.upload.message}
                      </p>
                    : null}
            </div>
        );
    }
}

function mapStateToProps(store) {
    return {
        upload: store.upload
    };
}

export default connect(mapStateToProps, uploadFile)(UploadUI);

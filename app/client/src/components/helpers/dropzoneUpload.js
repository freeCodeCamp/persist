import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { FloatingActionButton } from 'material-ui';
import { TextField } from 'redux-form-material-ui';
import { connect } from 'react-redux';
import * as uploadFile from '../../actions/uploadFile';
import Dropzone from 'react-dropzone';

const FILE_FIELD_NAME = 'files';

const renderDropzoneInput = field => {
    let files = field.input.value;
    if (files) {
        files = files.slice(0, 1);
    }
    return (
        <div>
            <Dropzone name={field.name} onDrop={(filesToUpload, e) => field.input.onChange(filesToUpload)}>
                <div>Drop the file here or click to select the file to upload</div>
            </Dropzone>
            {field.meta.touched && field.meta.error && <span className="error">{field.meta.error}</span>}
            {files && Array.isArray(files) && <ul>{files.map((file, i) => <li key={i}>{file.name}</li>)}</ul>}
        </div>
    );
};

class DropzoneUpload extends Component {
    constructor(props) {
        super(props);
    }

    onSubmit(data) {
        this.props.reset();
        this.props.uploadFile(this.props.url, data.files[0], data.source, data.comment);
    }

    render() {
        const { handleSubmit, reset } = this.props;

        return (
            <div>
                <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                    <div>
                        <label htmlFor={FILE_FIELD_NAME}>Files</label>
                        <Field name={FILE_FIELD_NAME} component={renderDropzoneInput} />
                    </div>
                    <Field name="source" component={TextField} floatingLabelText="Source" />
                    <Field name="comment" component={TextField} floatingLabelText="Comment" />
                    <div>
                        <FloatingActionButton type="submit" iconClassName="fa fa-upload" mini={true} />
                        <FloatingActionButton onClick={reset} iconClassName="fa fa-undo" mini={true} />
                    </div>
                </form>
                {this.props.upload.message}
            </div>
        );
    }
}

DropzoneUpload = reduxForm({
    form: 'simple'
})(DropzoneUpload);

const mapStateToProps = state => {
    return {
        upload: state.upload
    };
};

export default connect(mapStateToProps, uploadFile)(DropzoneUpload);

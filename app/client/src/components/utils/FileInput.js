import React, {Component} from 'react';
import {FloatingActionButton} from 'material-ui';
import {FileAttachment} from 'material-ui/svg-icons';

class FileInput extends Component {
    constructor(props) {
        super(props);
        const {Key, fileLink} = this.props;
        let downloadLink;
        if (Key && fileLink) {
            downloadLink = (<a href={fileLink}>{Key}</a>);
        }
        this.state = {
            inputFile: downloadLink || 'No file chosen'
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        const {input: {onChange}} = this.props;
        const file = e.target.files[0];
        onChange(file);
        this.inputFile(file);
    }

    inputFile(file) {
        let fileName = 'No file chosen';
        if (file && file.name) {
            fileName = file.name;
        }
        this.setState({
            inputFile: fileName
        });
    }

    render() {
        const {input: {value}, name} = this.props;

        return (
            <div>
                <FloatingActionButton onClick={() => this.input.click()} mini={true}>
                    <FileAttachment/>
                </FloatingActionButton>
                {this.state.inputFile}
                <input
                    ref={(c) => this.input = c}
                    style={{width: 0, height: 0}}
                    id={name}
                    type="file"
                    value={value}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default FileInput;

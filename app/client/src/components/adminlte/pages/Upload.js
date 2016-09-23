import React from 'react';
import * as uploadFile from '../../../actions/uploadFile';
import { connect } from 'react-redux';
import { FormGroup, Label, Button, Input, InputGroup } from 'reactstrap';

import FullScreenLoader from '../loadingScreen/FullScreenLoader';
import UploadUI from '../uploadUI/UploadUI';

export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          type: 'Student Data',
          chosen: false,
        }
        
    }   

    chooseData(e) {
      this.setState({type: e.target.value, chosen: true})
    }

    getUrl(fileTypes, name) {

        let typeToReturn;

        fileTypes.forEach((type) => {
          if (type.name === name) {
            typeToReturn = type.url;
            return;
          }
        });

        return typeToReturn;
     
    }

    render() {

      const fileTypes = [{name: 'Student Data', url: '/upload/studentdata'},
                         {name: 'College Data', url: '/upload/collegedata'}
                        ];

        return (
        	<div className='upload'>
            <h1> Upload </h1>
            <p> Which data would you like to upload? </p>

            <FormGroup>
              <Label for="fileType">Select</Label>
              <Input type="select" name="fileType" onChange={this.chooseData.bind(this)}>
                {fileTypes.map((type, i) => <option key={i}>{type.name}</option>)}
              </Input>
            </FormGroup>
            
            {this.state.chosen ? <UploadUI type={this.state.type} url={this.getUrl(fileTypes, this.state.type)} /> : null}
        	</div>
        	);
    }
}


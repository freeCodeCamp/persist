import React from 'react';
import * as actions from '../../../actions';
import { connect } from 'react-redux';

class Upload extends React.Component {
    constructor(props) {
        super(props);
    }   

    addFile(e) {
    	const files = e.target.files;
    	this.setState({files: files});
  	}

  	addItem() {

 
    // var data = new FormData();
    // data.append('file', this.state.files[0]);

    // $.ajax({
    //       url: '/upload',
    //       type: 'POST',
    //       data: data,
    //       cache: false,
    //       processData: false,
    //       contentType: false,
    //       error: function(jqXHR, textStatus, errorThrown) {
    //         console.log('ERRORS: ' + textStatus);
    //       },
    //       success: function(data) {
    //           console.log('success', data);
    //       }
    //     });

    this.props.uploadFile(this.state.files[0]);

  	}


    render() {
        return (
        	<div className='upload'>
        		<h1> Upload </h1>
        			<input type='file' name='photo' onChange={this.addFile.bind(this)}/> 
        			<button onClick={this.addItem.bind(this)} className='btn btn-primary'>Submit</button>

              {this.props.upload.pending ? <div><p>Loading</p><i style={{fontSize: '50px', textAlign: 'center'}} className="fa fa-spinner fa-spin fa-3x fa-fw"></i></div> : null}
              {this.props.upload.error ? <p> Error Found </p> : null}
              {this.props.upload.success ? <p> Success </p> : null}

        	</div>


        	);
    }
}

function mapStateToProps(state) {
  return { upload: state.upload };
}

export default connect(mapStateToProps, actions)(Upload);

import React from 'react';

class Upload extends React.Component {
    constructor(props) {
        super(props);
    }   

    addFile(e) {
    	const files = e.target.files;
    	this.setState({files: files});
  	}

  	addItem() {
 
    var data = new FormData();
    data.append('file', this.state.files[0]);

    $.ajax({
          url: '/upload',
          type: 'POST',
          data: data,
          cache: false,
          processData: false,
          contentType: false,
          error: function(jqXHR, textStatus, errorThrown) {
            console.log('ERRORS: ' + textStatus);
          },
          success: function(data) {
              console.log('success', data);
          }
        });
  	}


    render() {
        return (
        	<div className='upload'>
        		<h1> Upload </h1>
        		<form>
        			<input type='file' name='photo' onChange={this.addFile.bind(this)}/> 
        			<button onClick={this.addItem.bind(this)} className='btn btn-primary'>Submit</button>
        		</form>
        	</div>


        	);
    }
}

export default Upload;

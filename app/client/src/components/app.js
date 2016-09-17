import React, { Component } from 'react';

import Dashboard from './adminlte/Dashboard';

export default class App extends Component {
  render() {

  	let currentPage;

  	if (this.props.children) {
  		currentPage = React.cloneElement(this.props.children, ...this.props)
  	}

    return (
      <div>
      	<Dashboard currentPage={currentPage}/>
      </div>
    );
  }
}

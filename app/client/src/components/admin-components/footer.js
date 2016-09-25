import React, { Component } from 'react';

export default class Footer extends Component {

  render() {
    return (

      <footer className='main-footer'>
        <div className='pull-right hidden-xs'>
          <b>Version</b> 1.0.0
        </div>
        <strong>This project is a derivative of <a href='http://almsaeedstudio.com'>Almsaeed Studio</a>.</strong>
      </footer>

      );
  }

}
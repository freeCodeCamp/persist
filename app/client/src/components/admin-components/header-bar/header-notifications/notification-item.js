import React, { Component } from 'react';

export default class NotifcationItem extends Component {

  render() {
    return (
      <li key={ 'header-notification-item' }>
        <a href='#'><i className={ this.props.theme }></i> { this.props.content }</a>
      </li>
      );
  }

}
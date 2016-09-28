import React, { Component } from 'react';
import ContentHeader from '../admin-components/content-header';

export default class Content extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='content-provider'>
        <ContentHeader title={ this.props.title } desc={ this.props.desc } componentName={ this.props.componentName } />
        <section className='content'>
          { this.props.children }
        </section>
      </div>
      );
  }
}

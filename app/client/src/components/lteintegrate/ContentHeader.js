import React, { Component } from 'react';

export default class ContentHeader extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<section className="content-header">
	          <h1>
	            {this.props.title}
	            <small>{this.props.description}</small>
	          </h1>
	        </section>
		);
	}
}

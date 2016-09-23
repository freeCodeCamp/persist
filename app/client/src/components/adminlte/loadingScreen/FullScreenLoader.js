import React, { Component } from 'react';

export default class FullScreenLoader extends Component {
	render() {

		const fullPageStyle = {
			position: 'fixed',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			background: 'white',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			opacity: 0.3
		};

		const loaderStyle = {
			fontSize: '200px',
			textAlign: 'center'
		};

		return (
			<div style={fullPageStyle}>
				<i style={loaderStyle} className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
			</div>
		);
	}
}

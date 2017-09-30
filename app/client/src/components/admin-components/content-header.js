import React, { Component } from 'react';
import { Link } from 'react-router';

export default class ContentHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="content-header">
                <h1>
                    {this.props.title} <small>{this.props.description}</small>
                </h1>
                <ol className="breadcrumb">
                    <li>
                        <Link to="/">
                            <i className="fa fa-dashboard" /> Home
                        </Link>
                    </li>
                    <li className="active">{this.props.componentName}</li>
                </ol>
            </section>
        );
    }
}

import React, { Component } from 'react';
import { push } from 'react-router-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class MessageItem extends Component {
    handleClick(e, osis) {
        e.preventDefault();
        this.props.push(`/student/${osis}`);
    }

    render() {
        const { fullName } = this.props;
        const { time, osis } = this.props.reminder;
        let { description } = this.props.reminder;
        if (description.length > 50) {
            description = description.substring(0, 50) + '...';
        }
        return (
            <li>
                <a style={{ cursor: 'pointer' }} onClick={e => this.handleClick(e, osis)}>
                    <h4 style={{ margin: 0 }}>
                        {fullName}
                        <small><i className="fa fa-clock-o" /> {moment(time).fromNow()}</small>
                    </h4>
                    <p style={{ margin: 0 }}>{description}</p>
                </a>
            </li>
        );
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            push
        },
        dispatch
    );

export default connect(null, mapDispatchToProps)(MessageItem);

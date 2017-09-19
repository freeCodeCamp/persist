import React, { Component } from 'react';
import MessageItem from './message-item';
import { connect } from 'react-redux';

class HeaderMessages extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { reminders, studentsObj } = this.props;
        const messageList = reminders.map((reminder, iterator) => {
            const { fullName } = studentsObj[reminder.osis];
            return <MessageItem key={iterator} fullName={fullName} reminder={reminder} />;
        });

        return (
            <li className="dropdown messages-menu">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                    <i className="fa fa-envelope-o" />
                    {reminders.length > 0 ? <span className="label label-success">{reminders.length}</span> : null}
                </a>
                <ul className="dropdown-menu">
                    <li className="header">You have {reminders.length} follow ups</li>
                    <li>
                        {/* inner menu: contains the actual data */}
                        <div className="slimScrollDiv">
                            <ul className="menu">{messageList}</ul>
                            <div className="slimScrollBar" />
                            <div className="slimScrollRail" />
                        </div>
                    </li>
                    {/*<li className='footer'>*/}
                    {/*<a href='#'>See All Messages</a>*/}
                    {/*</li>*/}
                </ul>
            </li>
        );
    }
}

const mapStateToProps = state => ({
    studentsObj: state.students.osisObj,
    reminders: state.reminders
});

export default connect(mapStateToProps)(HeaderMessages);

import React, { Component } from 'react';

export default class Footer extends Component {
    render() {
        return (
            <footer className="main-footer">
                <div className="pull-right hidden-xs">
                    <b>Version</b> 1.0.0
                </div>
                <div><strong>PERS+ST:</strong> Postsecondary Enrollment Reporting System and Student Tracker</div>
            </footer>
        );
    }
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import HeaderMessages from './header-messages/header-messages';
import HeaderNotifications from './header-notifications/header-notifications';
import HeaderUser from './header-user';

class HeaderBar extends Component {
    pushMenu() {
        var body = document.body;
        if (body.clientWidth > 768) {
            if (body.className.indexOf('sidebar-collapse') === -1) {
                body.className += ' sidebar-collapse';
            } else {
                body.className = body.className.replace(' sidebar-collapse', '');
            }
        } else {
            if (body.className.indexOf('sidebar-open') === -1) {
                body.className += ' sidebar-open';
            } else {
                body.className = body.className.replace(' sidebar-open', '');
            }
        }
    }

    componentDidMount() {
        this.body = document.body;
    }

    render() {
        const { user: { firstName, lastName } } = this.props;
        return (
            <header className="main-header">
                {/* Logo */}
                <Link to="/" className="logo">
                    {/* mini logo for sidebar mini 50x50 pixels */}{' '}
                    <span className="logo-mini">
                        <b>N</b>YC
                    </span>
                    {/* logo for regular state and mobile devices */}{' '}
                    <span className="logo-lg" style={{fontSize: 15}}>
                        <b>NYC</b> Outward Bound Schools
                    </span>
                </Link>
                {/* Header Navbar: style can be found in header.less */}
                <nav className="navbar navbar-static-top" role="navigation">
                    {/* Sidebar toggle button*/}
                    <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button" onClick={() => this.pushMenu}>
                        <span className="sr-only">Toggle navigation</span>
                    </a>
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            {/* Messages: style can be found in dropdown.less*/}
                            <HeaderMessages />
                            {/* Notifications: style can be found in dropdown.less */}
                            <HeaderNotifications />
                            {/* User Account: style can be found in dropdown.less */}
                            <HeaderUser />
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }
}

const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(mapStateToProps)(HeaderBar);

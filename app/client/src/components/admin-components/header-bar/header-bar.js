import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import HeaderMessages from './header-messages/header-messages';
import HeaderNotifications from './header-notifications/header-notifications';

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
                    {/* mini logo for sidebar mini 50x50 pixels */} <span className="logo-mini"><b>N</b>YC</span>
                    {/* logo for regular state and mobile devices */} <span className="logo-lg"><b>NYC</b> Outward Bound</span>
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
                            <li className="dropdown user user-menu">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <img src="/default-profile-pic.png" className="user-image" alt="User Image" />
                                    <span className="hidden-xs">{`${firstName} ${lastName || ''}`.trim()}</span>
                                </a>
                                <ul className="dropdown-menu">
                                    {/* User image */}
                                    <li className="user-header">
                                        <img src="/default-profile-pic.png" className="img-circle" alt="User Image" />
                                        <p>
                                            {`${firstName} ${lastName || ''}`.trim()}
                                        </p>
                                    </li>
                                    {/* Menu Footer */}
                                    <li className="user-footer">
                                        <div style={{ textAlign: 'center' }}>
                                            <Link to="/logout" className="btn btn-default btn-flat">Sign out</Link>
                                        </div>
                                    </li>
                                </ul>
                            </li>
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

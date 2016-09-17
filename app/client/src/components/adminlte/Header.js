import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
    	return (
    		<div id='header'>
            <div id='logo' className='large_nav'>
                <span id='large'>AdminLTE</span>
                <span id='small' style={{display: 'none'}}>ALT</span>
            </div>
            <div id='nav_bar'>
                <div id='switch'>
                    <span className='icon'><i className='fa fa-bars' aria-hidden='true'></i></span>
                </div>
                <div id='nav_links'>
                    <div className='nav_link'>
                        <span className='icon'><i className='fa fa-envelope' aria-hidden='true'></i></span>
                    </div>
                    <div className='nav_link'>
                        <span className='icon'><i className='fa fa-bell-o' aria-hidden='true'></i></span>
                    </div>
                </div>
            </div>
        </div>
    	);
    }
}

export default Header;
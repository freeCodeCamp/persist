import React from 'react';
import { Link } from 'react-router';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
        	<div id='main_sidebar' className='large_nav'>
                <div id='sidebar_navigation'>
                    <div className='side_nav'>
                        <span className='icon'>
                            <i className='fa fa-dashboard' aria-hidden='true'></i>
                        </span>
                        <span className='desc'>
                            <Link to='/'>Dashboard</Link>
                        </span>
                    </div>
                    <div className='side_nav'>
                        <span className='icon'>
                            <i className='fa fa-child' aria-hidden='true'></i>
                        </span>
                        <span className='desc'>
                            <Link to='/students'>Students</Link>
                        </span>
                    </div>
                    <div className='side_nav'>
                        <span className='icon'>
                            <i className='fa fa-building' aria-hidden='true'></i>
                        </span>
                        <span className='desc'>
                            <Link to='/schools'>Schools</Link>
                        </span>
                    </div>
                    <div className='side_nav'>
                        <span className='icon'>
                            <i className='fa fa-list' aria-hidden='true'></i>
                        </span>
                        <span className='desc'>
                            List
                        </span>
                    </div>
                    <div className='side_nav'>
                        <span className='icon'>
                            <i className='fa fa-file-excel-o' aria-hidden='true'></i>
                        </span>
                        <span className='desc'>
                            <Link to='/upload'>Upload</Link>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;

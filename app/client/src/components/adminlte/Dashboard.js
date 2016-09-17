import React from 'react';

import Header from './Header';
import Sidebar from './Sidebar';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="app">
	           <Header />
               <div id="content">
                    <Sidebar />
                    <div id="main_content">
                        {this.props.currentPage}
                    </div>
               </div>
            </div>
        )
    }
}

export default Dashboard;

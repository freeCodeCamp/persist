import React from 'react';
import { Container } from 'reactstrap';
import Header from './Header';
import Sidebar from './Sidebar';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='app'>
	           <Header />
               <div id='content'>
                    <Sidebar />
                    <div id='main_content'>
                        <Container>
                            {this.props.currentPage}
                        </Container>
                    </div>
               </div>
            </div>
        );
    }
}

export default Dashboard;

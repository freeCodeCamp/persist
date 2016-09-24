import React from 'react';
import { Container } from 'reactstrap';
import Header from '../lteintegrate/Header';
import SideBar from '../lteintegrate/SideBar';
import SideBarBackGround from '../lteintegrate/SideBar';
import Content from '../lteintegrate/Content';
import Settings from '../lteintegrate/Settings';
import Footer from '../lteintegrate/Footer';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
    	        <Header />
                <SideBar />
                <Content currentPage={this.props.currentPage}/>
                <Settings />
                <Footer />
                <SideBarBackGround />
            </div>
        );
    }
}

export default Dashboard;

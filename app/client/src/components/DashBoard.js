import React, {Component} from 'react';
import HeaderBar from './admin-components/header-bar/header-bar';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getAllSchools, getAllStudents, getAllColleges} from '../actions'
import NavigationMenu from './admin-components/navigation-menu';
// import ControlPanel from './admin-components/control-panel';
import ControlMenu from './admin-components/controls-menu';
import Footer from './admin-components/footer';
import '../../public/style/main2.scss';
import {MaterialUIWrapper} from './helpers';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getAllStudents();
        this.props.getAllSchools();
        this.props.getAllColleges();
    }

    render() {
        return (
            <div className='wrapper'>
                <HeaderBar />
                <NavigationMenu />
                <section className='content-wrapper'>
                    <MaterialUIWrapper>
                        { this.props.currentPage }
                    </MaterialUIWrapper>
                </section>
                <Footer />
                <ControlMenu />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getAllStudents,
        getAllColleges,
        getAllSchools
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(Dashboard);

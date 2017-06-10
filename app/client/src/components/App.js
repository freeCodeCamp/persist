import React, { Component } from 'react';
import axios from 'axios';
import HeaderBar from './admin-components/header-bar/header-bar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllSchools, getNotifications, getAllStudents, getAllColleges, getAllCounselors, setSpinner } from '../actions';
import { Spinner } from './helpers';
import NavigationMenu from './admin-components/navigation-menu';
// import ControlPanel from './admin-components/control-panel';
import Footer from './admin-components/footer';
import '../../public/style/main2.scss';
import { MaterialUIWrapper } from './helpers';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            load: false,
            initialLoad: false
        };
    }

    componentWillMount() {
        axios
            .all([
                this.props.getAllStudents(),
                this.props.getAllSchools(),
                this.props.getAllColleges(),
                this.props.getAllCounselors(),
                this.props.getNotifications(0, 5)
            ])
            .then(results => {
                results.map(result => {
                    if (result && result.response && result.response.status === 401) {
                        window.location = '/logout';
                    }
                });
                this.setState(
                    {
                        ...this.state,
                        initialLoad: true
                    },
                    this.removeSpinner
                );
            });
    }

    componentDidMount() {
        this.resize();
        this.componentDidUpdate();
    }

    resize() {
        // triggering resize event
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('resize', true, false);
        window.dispatchEvent(evt);
    }

    componentWillReceiveProps(nextProps) {
        this.resize();
        if (this.props.currentPage != nextProps.currentPage) {
            this.props.setSpinner(true);
            this.setState({ ...this.state, load: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.spinner !== this.props.spinner || nextState.load !== this.state.load;
    }

    componentDidUpdate() {
        if (!this.state.load && this.state.initialLoad) {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    load: true
                });
            }, 500);
        } else if (this.state.load) {
            this.removeSpinner();
        }
    }

    removeSpinner() {
        if (this.state.initialLoad) {
            this.props.setSpinner(false);
        }
    }

    render() {
        const { load } = this.state;
        return (
            <div className="wrapper">
                <HeaderBar />
                <NavigationMenu />
                <section className="content-wrapper">
                    <Spinner />
                    {load
                        ? <MaterialUIWrapper>
                              {this.props.currentPage}
                          </MaterialUIWrapper>
                        : null}
                </section>
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    spinner: state.spinner.main
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            getAllStudents,
            getAllColleges,
            getAllSchools,
            getAllCounselors,
            getNotifications,
            setSpinner
        },
        dispatch
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

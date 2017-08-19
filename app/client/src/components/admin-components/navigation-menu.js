import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import List from '../helpers/List';
import { Permission } from '../authentication';

class NavigationMenu extends Component {
    constructor(props) {
        super(props);
        this.suggestionsObj = [];
        this.state = {
            listItems: [],
            searchName: '',
            display: 'none'
        };
    }

    onChange(event) {
        this.setState({
            searchName: event.target.value
        });
        this.getSuggestions(event.target.value);
    }

    getSuggestions(value) {
        if (value.length < 3) {
            this.setSuggestions([], 'none');
            return;
        }
        const { students, colleges, osisObj } = this.props;
        const osisStudent = osisObj[value];
        if (osisStudent) {
            const suggestion = {text: osisStudent.fullName, query: { fullName: osisStudent.fullName, model: 'student' }};
            this.suggestionsObj = [suggestion];
            return this.setSuggestions([suggestion], 'block');
        }
        const sortingFunc = (s1, s2) => {
            if (!s1.text && s2.text) return 1;
            if (!s2.text && s1.text) return -1;
            if (!s2.text && !s1.text) return 0;
            const o1 = s1.text.toLowerCase();
            const o2 = s2.text.toLowerCase();
            if (o1.startsWith(value)) {
                return o2.startsWith(value) ? o1.localeCompare(o2) : -1;
            } else {
                return o2.startsWith(value) ? 1 : o1.localeCompare(o2);
            }
        };
        const regex = new RegExp('.*' + value + '.*', 'i');
        const studentsObj = _(students)
            .filter(student => regex.test(student['fullName']))
            .map(student => ({ text: student['fullName'], query: { fullName: student['fullName'], model: 'student' } }))
            .uniqBy('text')
            .sort(sortingFunc)
            .take(5);
        const collegesObj = _(colleges)
            .filter(college => regex.test(college['fullName']))
            .map(college => ({ text: college['fullName'], query: { fullName: college['fullName'], model: 'college' } }))
            .uniqBy('text')
            .sort(sortingFunc)
            .take(5);
        const suggestionsObj = studentsObj.concat(collegesObj.value()).sort(sortingFunc).take(5);
        this.suggestionsObj = suggestionsObj.value();
        this.setSuggestions(suggestionsObj, 'block');
    }

    setSuggestions(suggestionsObj, display) {
        const listItems = _(suggestionsObj).map('text').value();
        this.setState({
            listItems: listItems.length < 1 ? ['No results found'] : listItems,
            display
        });
    }

    search(e) {
        if (e) {
            e.preventDefault();
        }
        const suggestion = this.suggestionsObj.find(suggestion => suggestion.text === this.state.searchName);

        if (suggestion) {
            this.props.push(`/search?${$.param(suggestion.query)}`);
        }
        this.setState({
            searchName: ''
        });
        this.suggestionsObj = [];
    }

    onClick(value) {
        if (value === 'No results found') value = '';
        this.setState(
            {
                listItems: [],
                searchName: value,
                display: 'none'
            },
            () => this.search()
        );
    }

    render() {
        const { user: { firstName, lastName } } = this.props;
        return (
            <aside className="main-sidebar">
                {/* sidebar: style can be found in sidebar.less */}
                <section className="sidebar">
                    {/* Sidebar user panel */}
                    <div className="user-panel">
                        <div className="pull-left image">
                            <img src="/default-profile-pic.png" className="img-circle" alt="User Image" />
                        </div>
                        <div className="pull-left info">
                            <p>
                                {`${firstName} ${lastName || ''}`.trim()}
                            </p>
                            <a href="#"><i className="fa fa-circle text-success" /> Online</a>
                        </div>
                    </div>
                    {/* search form */}
                    <form action="#" method="get" className="sidebar-form">
                        <div className="input-group">
                            <input
                                type="text"
                                name="q"
                                className="form-control"
                                value={this.state.searchName}
                                onChange={this.onChange.bind(this)}
                                placeholder="Search..."
                            />
                            <span className="input-group-btn">
                                <button
                                    type="submit"
                                    onClick={this.search.bind(this)}
                                    name="search"
                                    id="search-btn"
                                    className="btn btn-flat"
                                >
                                    <i className="fa fa-search" />
                                </button>
                            </span>
                        </div>
                        <div style={{ backgroundColor: 'white', display: this.state.display }}>
                            <List listItems={this.state.listItems} onClick={this.onClick.bind(this)} />
                        </div>
                    </form>
                    {/* /.search form */}
                    {/* sidebar menu: : style can be found in sidebar.less */}
                    <ul className="sidebar-menu">
                        <li className="header">
                            MAIN NAVIGATION
                        </li>
                        <li className="active">
                            <Link to="/">
                                <i className="fa fa-dashboard" /> <span>Dashboard</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to="/schools">
                                <i className="fa ion-university" /> <span>High Schools</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to="/students">
                                <i className="fa fa-users" /> <span>Students</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to="/colleges">
                                <i className="fa fa-graduation-cap" /> <span>Colleges</span>
                            </Link>
                        </li>
                        <Permission role="Owner">
                            <li className="">
                                <Link to="/upload">
                                    <i className="fa fa-upload" /> <span>Upload</span>
                                </Link>
                            </li>
                        </Permission>
                        <Permission role="Owner">
                            <li>
                                <Link to="/invite-users">
                                    <i className="fa fa-envelope" /> <span>Invite</span>
                                </Link>
                            </li>
                        </Permission>
                        <Permission role="Owner">
                            <li>
                                <Link to="/recovery">
                                    <i className="fa fa-undo" /> <span>Recovery</span>
                                </Link>
                            </li>
                        </Permission>
                    </ul>
                </section>
                {/* /.sidebar */}
            </aside>
        );
    }
}

const mapStateToProps = state => {
    return {
        students: state.students.value,
        osisObj: state.students.osisObj,
        colleges: state.colleges.value,
        user: state.auth.user
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            push
        },
        dispatch
    );
};

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(mapStateToProps, mapDispatchToProps)(NavigationMenu);

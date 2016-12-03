import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {push} from 'react-router-redux';
import {Link} from 'react-router';
import List from '../helpers/List';

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
        const {students, colleges} = this.props;
        const regex = new RegExp('.*' + value + '.*', 'i');
        const studentsObj = _(students)
            .filter((student) => (regex.test(student['fullName'])))
            .map((student) => ({text: student['fullName'], query: {fullName: student['fullName'], model: 'student'}}))
            .uniqBy('text')
            .sort(sortingFunc)
            .take(5);
        const collegesObj = _(colleges)
            .filter((college) => ((regex.test(college['fullName']))))
            .map((college) => ({text: college['fullName'], query: {fullName: college['fullName'], model: 'college'}}))
            .uniqBy('text')
            .sort(sortingFunc)
            .take(5);
        const suggestionsObj = studentsObj
            .concat(collegesObj.value())
            .sort(sortingFunc)
            .take(5);
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
        e.preventDefault();
        const suggestion = this.suggestionsObj
            .find((suggestion) => (suggestion.text === this.state.searchName));
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
        this.setState({
            listItems: [],
            searchName: value,
            display: 'none'
        });
    }

    render() {
        return (
            <aside className='main-sidebar'>
                { /* sidebar: style can be found in sidebar.less */ }
                <section className='sidebar'>
                    { /* Sidebar user panel */ }
                    <div className='user-panel'>
                        <div className='pull-left image'>
                            <img src='/molly.PNG' className='img-circle' alt='User Image'/>
                        </div>
                        <div className='pull-left info'>
                            <p>
                                Molly Dunbar
                            </p>
                            <a href='#'><i className='fa fa-circle text-success'></i> Online</a>
                        </div>
                    </div>
                    { /* search form */ }
                    <form action='#' method='get' className='sidebar-form'>
                        <div className='input-group'>
                            <input type='text'
                                   name='q'
                                   className='form-control'
                                   value={ this.state.searchName }
                                   onChange={ this.onChange.bind(this) }
                                   placeholder='Search...'/>
                            <span className='input-group-btn'>
                                <button
                                    type='submit'
                                    onClick={this.search.bind(this)}
                                    name='search'
                                    id='search-btn'
                                    className='btn btn-flat'>
                                    <i className='fa fa-search'/>
                                </button>
                            </span>
                        </div>
                        <div style={ {backgroundColor: 'white', display: this.state.display} }>
                            <List listItems={ this.state.listItems } onClick={ this.onClick.bind(this) }/>
                        </div>
                    </form>
                    { /* /.search form */ }
                    { /* sidebar menu: : style can be found in sidebar.less */ }
                    <ul className='sidebar-menu'>
                        <li className='header'>
                            MAIN NAVIGATION
                        </li>
                        <li className='active'>
                            <Link to='/'>
                                <i className='fa fa-dashboard'></i> <span>Dashboard</span>
                            </Link>
                        </li>
                        <li className=''>
                            <Link to='/schools'>
                                <i className='fa ion-university'></i> <span>Schools</span>
                            </Link>
                        </li>
                        <li className=''>
                            <Link to='/students'>
                                <i className='fa fa-users'></i> <span>Students</span>
                            </Link>
                        </li>
                        <li className=''>
                            <Link to='/colleges'>
                                <i className='fa fa-graduation-cap'></i> <span>Colleges</span>
                            </Link>
                        </li>
                        <li className=''>
                            <Link to='/upload'>
                                <i className='fa fa-upload'></i> <span>Upload</span>
                            </Link>
                        </li>
                    </ul>
                </section>
                { /* /.sidebar */ }
            </aside>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        students: state.students.value,
        colleges: state.colleges.value
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        push
    }, dispatch);
};

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(mapStateToProps, mapDispatchToProps)(NavigationMenu);

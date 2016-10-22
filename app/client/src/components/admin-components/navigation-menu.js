import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { getSuggestions } from '../../actions/getSuggestions';
import List from '../helpers/List';

class NavigationMenu extends Component {

  constructor(props) {
    super(props);
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
    this.props.getSuggestions('firstName', event.target.value);
  }

  onClick(value) {
    this.setState({
      listItems: [],
      searchName: value,
      display: 'none'
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions.length > 0) {
      this.setState({
        listItems: nextProps.suggestions,
        display: 'block'
      });
    } else {
      this.setState({
        listItems: [],
        display: 'none'
      });
    }
  }

  render() {
    return (
      <aside className='main-sidebar'>
        { /* sidebar: style can be found in sidebar.less */ }
        <section className='sidebar'>
          { /* Sidebar user panel */ }
          <div className='user-panel'>
            <div className='pull-left image'>
              <img src='/molly.PNG' className='img-circle' alt='User Image' />
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
                placeholder='Search...' />
              <span className='input-group-btn'><button type='submit'
                                                  name='search'
                                                  id='search-btn'
                                                  className='btn btn-flat'> <i className='fa fa-search'></i> </button></span>
            </div>
            <div style={ { backgroundColor: 'white', display: this.state.display } }>
              <List listItems={ this.state.listItems } onClick={ this.onClick.bind(this) } />
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
    suggestions: state.suggestions
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getSuggestions
  }, dispatch);
};

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(mapStateToProps, mapDispatchToProps)(NavigationMenu);
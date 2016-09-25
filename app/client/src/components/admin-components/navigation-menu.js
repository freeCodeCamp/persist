import React, { Component } from 'react';
import { Link } from 'react-router';

export default class NavigationMenu extends Component {

  render() {
    return (
      <aside className='main-sidebar'>
        { /* sidebar: style can be found in sidebar.less */ }
        <section className='sidebar'>
          { /* Sidebar user panel */ }
          <div className='user-panel'>
            <div className='pull-left image'>
              <img src='dist/img/user2-160x160.jpg' className='img-circle' alt='User Image' />
            </div>
            <div className='pull-left info'>
              <p>
                Alexander Pierce
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
                placeholder='Search...' />
              <span className='input-group-btn'><button type='submit'
                                                  name='search'
                                                  id='search-btn'
                                                  className='btn btn-flat'> <i className='fa fa-search'></i> </button></span>
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
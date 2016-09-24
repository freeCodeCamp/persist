import React, { Component } from 'react';
import { Link } from 'react-router'

export default class SideBar extends Component {
  render() {
    return (
      <aside className="main-sidebar">

        <section className="sidebar">

          
          <div className="user-panel">
            <div className="pull-left image">
              <img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User Image"/>
            </div>
            <div className="pull-left info">
              <p>Sachin Mour</p>
             
              <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
            </div>
          </div>

         
          <form action="#" method="get" className="sidebar-form">
            <div className="input-group">
              <input type="text" name="q" className="form-control" placeholder="Search..."/>
              <span className="input-group-btn">
                <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search"></i></button>
              </span>
            </div>
          </form>
         
          <ul className="sidebar-menu">
            <li className="header">Options</li>
           
            <li className="active"><Link to='/'><i className="fa fa-link"></i>Dashboard</Link></li>
            <li><Link to='/students'><i className="fa fa-link"></i>Students</Link></li>
            <li><Link to='/schools'><i className="fa fa-link"></i>Schools</Link></li>
            <li><Link to='/colleges'><i className="fa fa-link"></i>Colleges</Link></li>
            <li><Link to='/upload'><i className="fa fa-link"></i>Upload</Link></li>
          </ul>
        </section>
      
      </aside>

     
      
     
      

     
      
      
    );
  }
}



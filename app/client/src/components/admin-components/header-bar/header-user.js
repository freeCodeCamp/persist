import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';

const HeaderUser = (props) => {
  const { user: { firstName, lastName } } = props;
  return (
    <li className="dropdown user user-menu">
      <a href="#" className="dropdown-toggle" data-toggle="dropdown">
          <img src="/default-profile-pic.png" className="user-image" alt="User Image" />
          <span className="hidden-xs">{`${firstName} ${lastName || ''}`.trim()}</span>
      </a>
      <ul className="dropdown-menu">
          {/* User image */}
          <li className="user-header">
              <img src="/default-profile-pic.png" className="img-circle" alt="User Image" />
              <p>
                  {`${firstName} ${lastName || ''}`.trim()}
              </p>
          </li>
          {/* Menu Footer */}
          <li className="user-footer">
              <div style={{ textAlign: 'center' }}>
                  <Link to="/logout" className="btn btn-default btn-flat">Sign out</Link>
              </div>
          </li>
      </ul>
    </li>
  );
}



const mapStateToProps = (state) => ({
    user: state.auth.user
});

export default connect(mapStateToProps)(HeaderUser);
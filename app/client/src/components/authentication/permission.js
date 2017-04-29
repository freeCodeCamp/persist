import React from 'react';
import { connect } from 'react-redux';
import { getRole } from '../../../../common/constants';

const Permission = ({ auth, role, children }) => {
    if (auth.authenticated && getRole(auth.user.role) >= getRole(role)) {
        return children;
    }
    return null;
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Permission);

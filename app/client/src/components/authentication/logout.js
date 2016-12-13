import cookie from 'react-cookie';
import {LOGOUT} from '../../actions/types';

// react-router onEnter hook for logout
const logout = (dispatch, nextState, replace) => {
    cookie.remove('token', {path: '/'});
    cookie.remove('user', {path: '/'});
    dispatch({
        type: LOGOUT
    });
    replace('/login');
};

export default logout;

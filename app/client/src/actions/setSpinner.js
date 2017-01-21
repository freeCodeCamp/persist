import {SPINNER} from './types';

const setSpinner = (status) => {
    return (dispatch) => {
        dispatch({
            type: SPINNER,
            payload: status
        });
    }
};

export default setSpinner;

import { SPINNER_PAGE } from './types';

const setSpinnerPage = status => {
    return dispatch => {
        dispatch({
            type: SPINNER_PAGE,
            payload: status
        });
    };
};

export default setSpinnerPage;

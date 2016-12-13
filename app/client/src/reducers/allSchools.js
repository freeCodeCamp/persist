import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import {
    GET_ALL_SCHOOLS_SUCCESS,
    GET_ALL_SCHOOLS_ERROR,
    GET_ALL_SCHOOLS_PENDING
} from '../actions/types';

export default function (state = {
    pending: false,
    success: false,
    error: false,
    value: [],
    schoolSource: [],
    idObj: {}
}, action) {

    switch (action.type) {
        case GET_ALL_SCHOOLS_PENDING:
            return {
                ...state,
                pending: true
            };
        case GET_ALL_SCHOOLS_SUCCESS:
            return {
                ...state,
                pending: false,
                success: true,
                value: action.payload,
                idObj: keyBy(action.payload, '_id'),
                schoolSource: map(action.payload, (school) => ({
                    text: school.name,
                    value: school._id
                }))
            };
        case GET_ALL_SCHOOLS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.payload
            };
        default:
            return state;
    }
}
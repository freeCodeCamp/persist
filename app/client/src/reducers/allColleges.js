import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import { GET_ALL_COLLEGES_SUCCESS, GET_ALL_COLLEGES_ERROR, GET_ALL_COLLEGES_PENDING, UPDATE_COLLEGE } from '../actions/types';

export default function(
    state = {
        pending: false,
        success: false,
        error: false,
        value: [],
        collegeSource: [],
        idObj: {}
    },
    action
) {
    switch (action.type) {
        case GET_ALL_COLLEGES_PENDING:
            return {
                ...state,
                pending: true
            };
        case GET_ALL_COLLEGES_SUCCESS:
            return {
                ...state,
                pending: false,
                success: true,
                value: action.payload,
                idObj: keyBy(action.payload, '_id'),
                collegeSource: map(action.payload, college => ({
                    text: college.fullName,
                    value: college._id
                }))
            };
        case UPDATE_COLLEGE:
            const college = action.payload;
            const { _id } = college;
            const newState = cloneDeep(state);
            const index = newState.value.findIndex({ _id });
            newState.value[index] = college;
            newState.idObj[_id] = college;
            return newState;
        case GET_ALL_COLLEGES_ERROR:
            return {
                ...state,
                pending: false,
                error: action.payload
            };
        default:
            return state;
    }
}

import keyBy from 'lodash/keyBy';
import cloneDeep from 'lodash/cloneDeep';
import {
    GET_ALL_STUDENTS_SUCCESS,
    GET_ALL_STUDENTS_ERROR,
    GET_ALL_STUDENTS_PENDING,
    UPDATE_STUDENT
} from '../actions/types';

const defaultState = {
    pending: false,
    success: false,
    error: false,
    value: [],
    osisObj: {}
};

export default function (state = defaultState, action) {

    switch (action.type) {
        case GET_ALL_STUDENTS_PENDING:
            return {
                ...state,
                pending: true
            };
        case GET_ALL_STUDENTS_SUCCESS:
            return {
                ...state,
                pending: false,
                success: true,
                value: action.payload,
                osisObj: keyBy(action.payload, 'osis')
            };
        case UPDATE_STUDENT:
            const student = action.payload;
            const newState = cloneDeep(state);
            const index = newState.value.findIndex({osis: student.osis});
            newState.value[index] = student;
            newState.osisObj[osis] = student;
            return newState;
        case GET_ALL_STUDENTS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.payload
            };
        default:
            return state;
    }
}
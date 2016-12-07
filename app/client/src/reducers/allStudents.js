import keyBy from 'lodash/keyBy';
import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import {
    GET_ALL_STUDENTS_SUCCESS,
    GET_ALL_STUDENTS_ERROR,
    GET_ALL_STUDENTS_PENDING,
    UPDATE_STUDENT,
    SAVE_DOCUMENT_SUCCESS,
    SAVE_DOCUMENT_ERROR,
    DELETE_DOCUMENT_SUCCESS,
    DELETE_DOCUMENT_ERROR
} from '../actions/types';

const defaultState = {
    pending: false,
    success: false,
    error: false,
    value: [],
    osisObj: {}
};

export default function (state = defaultState, action) {
    let osis;
    let newState;
    let index;
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
        case SAVE_DOCUMENT_SUCCESS:
        case DELETE_DOCUMENT_SUCCESS:
            const documents = action.payload;
            osis = action.osis;
            newState = cloneDeep(state);
            index = findIndex(newState.value, (s) => (s.osis === osis));
            newState.value[index].documents = documents;
            newState.osisObj[osis].documents = documents;
            return newState;
        case UPDATE_STUDENT:
            const student = action.payload;
            osis = student.osis;
            newState = cloneDeep(state);
            index = findIndex(newState.value, (s) => (s.osis === osis));
            newState.value[index] = student;
            newState.osisObj[osis] = student;
            return newState;
        case GET_ALL_STUDENTS_ERROR:
        case DELETE_DOCUMENT_ERROR:
        case SAVE_DOCUMENT_ERROR:
            return {
                ...state,
                pending: false,
                error: action.payload
            };
        default:
            return state;
    }
}
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
    DELETE_DOCUMENT_ERROR,
    SAVE_CASE_NOTE_SUCCESS,
    SAVE_CASE_NOTE_ERROR,
    DELETE_CASE_NOTE_SUCCESS,
    DELETE_CASE_NOTE_ERROR,
    SAVE_APPLICATION_SUCCESS,
    SAVE_APPLICATION_ERROR,
    SAVE_TERM_SUCCESS,
    SAVE_TERM_ERROR,
    SAVE_ALIAS_SUCCESS,
    SAVE_ALIAS_ERROR,
    DELETE_APPLICATION_SUCCESS,
    DELETE_APPLICATION_ERROR,
    DELETE_TERM_SUCCESS,
    DELETE_TERM_ERROR,
    DELETE_ALIAS_SUCCESS,
    DELETE_ALIAS_ERROR
} from '../actions/types';

const defaultState = {
    pending: false,
    success: false,
    error: false,
    value: [],
    osisObj: {}
};

export default function(state = defaultState, action) {
    let osis, newState, index, _id;
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
            index = findIndex(newState.value, s => s.osis === osis);
            newState.value[index].documents = documents;
            newState.osisObj[osis].documents = documents;
            return newState;
        case SAVE_CASE_NOTE_SUCCESS:
            const caseNotes = action.payload;
            osis = action.osis;
            newState = cloneDeep(state);
            index = findIndex(newState.value, s => s.osis === osis);
            newState.value[index].caseNotes = caseNotes;
            newState.osisObj[osis].caseNotes = caseNotes;
            return newState;
        case DELETE_CASE_NOTE_SUCCESS:
            osis = action.osis;
            _id = action._id;
            newState = cloneDeep(state);
            index = findIndex(newState.value, s => s.osis === osis);
            newState.value[index].caseNotes = newState.value[index].caseNotes.filter(
                caseNote => caseNote._id.toString() !== _id.toString()
            );
            newState.osisObj[osis].caseNotes = cloneDeep(newState.value[index].caseNotes);
            return newState;
        case SAVE_APPLICATION_SUCCESS:
            const applications = action.payload;
            osis = action.osis;
            newState = cloneDeep(state);
            index = findIndex(newState.value, s => s.osis === osis);
            newState.value[index].applications = applications;
            newState.osisObj[osis].applications = applications;
            return newState;
        case DELETE_APPLICATION_SUCCESS:
            osis = action.osis;
            _id = action._id;
            newState = cloneDeep(state);
            index = findIndex(newState.value, s => s.osis === osis);
            newState.value[index].applications = newState.value[index].applications.filter(
                application => application._id.toString() !== _id.toString()
            );
            newState.osisObj[osis].applications = cloneDeep(newState.value[index].applications);
            return newState;
        case SAVE_TERM_SUCCESS:
            const terms = action.payload;
            osis = action.osis;
            newState = cloneDeep(state);
            index = findIndex(newState.value, s => s.osis === osis);
            newState.value[index].terms = terms;
            newState.osisObj[osis].terms = terms;
            return newState;
        case DELETE_TERM_SUCCESS:
            osis = action.osis;
            _id = action._id;
            newState = cloneDeep(state);
            index = findIndex(newState.value, s => s.osis === osis);
            newState.value[index].terms = newState.value[index].terms.filter(term => term._id.toString() !== _id.toString());
            newState.osisObj[osis].terms = cloneDeep(newState.value[index].terms);
            return newState;
        case SAVE_ALIAS_SUCCESS:
            const aliases = action.payload;
            osis = action.osis;
            newState = cloneDeep(state);
            index = findIndex(newState.value, s => s.osis === osis);
            newState.value[index].aliases = aliases;
            newState.osisObj[osis].aliases = aliases;
            return newState;
        case DELETE_ALIAS_SUCCESS:
            osis = action.osis;
            _id = action._id;
            newState = cloneDeep(state);
            index = findIndex(newState.value, s => s.osis === osis);
            newState.value[index].aliases = newState.value[index].aliases.filter(alias => alias._id.toString() !== _id.toString());
            newState.osisObj[osis].aliases = cloneDeep(newState.value[index].aliases);
            return newState;
        case UPDATE_STUDENT:
            const student = action.payload;
            osis = student.osis;
            newState = cloneDeep(state);
            index = findIndex(newState.value, s => s.osis === osis);
            newState.value[index] = student;
            newState.osisObj[osis] = student;
            return newState;
        case GET_ALL_STUDENTS_ERROR:
        case DELETE_DOCUMENT_ERROR:
        case SAVE_DOCUMENT_ERROR:
        case SAVE_CASE_NOTE_ERROR:
        case DELETE_CASE_NOTE_ERROR:
        case SAVE_APPLICATION_ERROR:
        case DELETE_APPLICATION_ERROR:
        case SAVE_TERM_ERROR:
        case DELETE_TERM_ERROR:
        case SAVE_ALIAS_ERROR:
        case DELETE_ALIAS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.payload
            };
        default:
            return state;
    }
}

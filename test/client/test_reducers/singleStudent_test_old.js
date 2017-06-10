import { expect } from '../test_helper';
import { GET_STUDENT_SUCCESS, GET_STUDENT_ERROR, GET_STUDENT_PENDING } from '../../app/client/src/actions/types';
import singleStudentReducer from '../../app/client/src/reducers/singleStudent';

const initialState = { pending: false, success: false, error: false, student: null };

describe('Get College Reducer', () => {
    it('handles action with unknown type', () => {
        expect(singleStudentReducer(initialState, {})).to.deep.eql(initialState);
    });

    describe('Handles outcomes correctly', () => {
        const student = [{ fullName: 'test' }];

        it('handles pending', () => {
            const action = { type: GET_STUDENT_PENDING };
            const expectedOutcome = {
                ...initialState,
                pending: true
            };
            expect(singleStudentReducer(initialState, action)).to.eql(expectedOutcome);
        });

        it('handles success', () => {
            const action = { type: GET_STUDENT_SUCCESS, payload: student };
            const expectedOutcome = {
                ...initialState,
                success: true,
                student
            };
            expect(singleStudentReducer(initialState, action)).to.eql(expectedOutcome);
        });

        it('handles error', () => {
            const action = { type: GET_STUDENT_ERROR, payload: new Error('Error found') };
            const expectedOutcome = {
                ...initialState,
                error: new Error('Error found')
            };
            expect(singleStudentReducer(initialState, action)).to.eql(expectedOutcome);
        });
    });
});

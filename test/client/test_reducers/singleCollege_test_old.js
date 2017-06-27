import { expect } from '../test_helper';
import { GET_COLLEGE_SUCCESS, GET_COLLEGE_ERROR, GET_COLLEGE_PENDING, GET_COLLEGE_RESET } from '../../app/client/src/actions/types';
import singleCollegeReducer from '../../app/client/src/reducers/singleCollege';

const initialState = { pending: false, success: false, error: false, college: null };

describe('Single College Reducer', () => {
    it('handles action with unknown type', () => {
        expect(singleCollegeReducer(initialState, {})).to.deep.eql(initialState);
    });

    describe('Handles outcomes correctly', () => {
        const college = [{ fullName: 'test' }];

        it('handles pending', () => {
            const action = { type: GET_COLLEGE_PENDING };
            const expectedOutcome = {
                ...initialState,
                pending: true
            };
            expect(singleCollegeReducer(initialState, action)).to.eql(expectedOutcome);
        });

        it('handles success', () => {
            const action = { type: GET_COLLEGE_SUCCESS, payload: college };
            const expectedOutcome = {
                ...initialState,
                success: true,
                college
            };
            expect(singleCollegeReducer(initialState, action)).to.eql(expectedOutcome);
        });

        it('handles error', () => {
            const action = { type: GET_COLLEGE_ERROR, payload: new Error('Error found') };
            const expectedOutcome = {
                ...initialState,
                error: new Error('Error found')
            };
            expect(singleCollegeReducer(initialState, action)).to.eql(expectedOutcome);
        });
    });
});

import { expect } from '../test_helper';
import {
    FILTER_COLLEGE_SUCCESS,
    FILTER_COLLEGE_ERROR,
    FILTER_COLLEGE_PENDING,
    FILTER_COLLEGE_RESET
} from '../../app/client/src/actions/types';
import collegeReducer from '../../app/client/src/reducers/collegeFilter';

const initialState = { pending: false, success: false, error: false, colleges: [] };

describe('College Filter Reducer', () => {
    it('handles action with unknown type', () => {
        expect(collegeReducer(initialState, {})).to.deep.eql(initialState);
    });

    describe('Handles outcomes correctly', () => {
        const colleges = [{ fullName: 'test' }, { fullName: 'test2' }];

        it('handles pending', () => {
            const action = { type: FILTER_COLLEGE_PENDING };
            const expectedOutcome = {
                ...initialState,
                pending: true
            };
            expect(collegeReducer(initialState, action)).to.eql(expectedOutcome);
        });

        it('handles success', () => {
            const action = { type: FILTER_COLLEGE_SUCCESS, payload: colleges };
            const expectedOutcome = {
                ...initialState,
                success: true,
                colleges
            };
            expect(collegeReducer(initialState, action)).to.eql(expectedOutcome);
        });

        it('handles error', () => {
            const action = { type: FILTER_COLLEGE_ERROR, payload: new Error('Error found') };
            const expectedOutcome = {
                ...initialState,
                error: new Error('Error found')
            };
            expect(collegeReducer(initialState, action)).to.eql(expectedOutcome);
        });
    });
});

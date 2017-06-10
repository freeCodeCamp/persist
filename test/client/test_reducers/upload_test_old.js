import { expect } from '../test_helper';
import { UPLOAD_FILE_SUCCESS, UPLOAD_FILE_ERROR, UPLOAD_FILE_PENDING } from '../../app/client/src/actions/types';
import uploadReducer from '../../app/client/src/reducers/upload';

const initialState = {
    message: null
};

describe('Get College Reducer', () => {
    it('handles action with unknown type', () => {
        expect(uploadReducer(initialState, {})).to.deep.eql(initialState);
    });

    describe('Handles outcomes correctly', () => {
        const message = 'Test message';

        it('handles success', () => {
            const action = { type: UPLOAD_FILE_SUCCESS, payload: message };
            const expectedOutcome = {
                ...initialState,
                message
            };
            expect(uploadReducer(initialState, action)).to.eql(expectedOutcome);
        });

        it('handles error', () => {
            const action = { type: UPLOAD_FILE_ERROR, payload: message };
            const expectedOutcome = {
                ...initialState,
                message
            };
            expect(uploadReducer(initialState, action)).to.eql(expectedOutcome);
        });
    });
});

/*import { expect } from '../test_helper';
import commentReducer from '../../src/reducers/comments';
import { SAVE_COMMENT } from '../../src/actions/types';

describe('Comments Reducer', () => {

	it('handles action with unknown type', () => {
		expect(commentReducer(undefined, {})).to.be.instanceof(Array);

		//deep comparison - not checking absolute identical object
		expect(commentReducer(undefined, {})).to.eql([]);
	});

	describe('Handles Types', () => {

		it('SAVE_COMMENT', () => {
			const action = { type: SAVE_COMMENT, payload: 'new comment'}
			expect(commentReducer([], action)).to.eql(['new comment']);
		});

	})

});
*/
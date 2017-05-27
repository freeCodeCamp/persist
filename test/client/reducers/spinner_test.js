import { expect } from '../test_helper';
import { SPINNER } from '../../app/client/src/actions/types';
import spinnerReducer from '../../app/client/src/reducers/spinner';

describe('Spinner Reducer', () => {

	it('handles action with unknown type', () => {
		expect(spinnerReducer(false, {})).to.eql(false);
	});

	describe('Handles Types', () => {

		it('sets SPINNER value from payload', () => {
			const action = { type: SPINNER, payload: true};
			expect(spinnerReducer(false, action)).to.eql(true);
		});
	});

});

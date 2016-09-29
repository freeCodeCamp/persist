import { expect } from '../test_helper';
import { FILTER_STUDENT_SUCCESS, FILTER_STUDENT_ERROR, FILTER_STUDENT_PENDING } from '../../app/client/src/actions/types';
import studentFilterReducer from '../../app/client/src/reducers/studentFilter';

const initialState = { pending: false, success: false, error: false, students: [] }

describe('Student Filter Reducer', () => {

	it('handles action with unknown type', () => {
		expect(studentFilterReducer(initialState, {})).to.deep.eql(initialState);
	});

	describe('Handles outcomes correctly', () => {

		const students = [{fullName: 'test'}, {fullName: 'test2'}];

		it('handles pending', () => {
			const action = { type: FILTER_STUDENT_PENDING };
			const expectedOutcome = {
				...initialState,
				pending: true
			}
			expect(studentFilterReducer(initialState, action)).to.eql(expectedOutcome);
		});

		it('handles success', () => {
			const action = { type: FILTER_STUDENT_SUCCESS, payload: students };
			const expectedOutcome = {
				...initialState,
				success: true,
				students
			}
			expect(studentFilterReducer(initialState, action)).to.eql(expectedOutcome);
		});
		

		it('handles error', () => {
			const action = { type: FILTER_STUDENT_ERROR, payload: new Error('Error found') };
			const expectedOutcome = {
				...initialState,
				error: new Error('Error found')
			}
			expect(studentFilterReducer(initialState, action)).to.eql(expectedOutcome);
		});
		
	});

});

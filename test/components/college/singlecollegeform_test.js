import { renderComponent, expect } from '../../test_helper';
import SingleCollegeForm from '../../../app/client/src/components/college/SingleCollegeForm';

describe('SingleCollegeForm', () => {

	let component;

	beforeEach(() => {
		component = renderComponent(SingleCollegeForm);
	});
	
	it('has correct id', () => {
		expect(component).to.have.id('single-student-page');
	});

	it('shows a student form', () => {
		expect(component.find('form')).to.have.class('single-student-form');
	});

	it('shows an edit button when editable is set to false', () => {
		expect(component.find('button')).to.contain('Edit');
		expect(component.find('button')).not.to.contain('Submit');
		expect(component.find('button')).not.to.contain('Undo Changes');
	});

	it('shows a submit and undo changes button when edit button clicked', () => {
		component.find('button').simulate('click');
		expect(component.find('button')).to.not.contain('Edit');
		expect(component.find('button')).to.contain('Submit');
		expect(component.find('button')).to.contain('Undo Changes');
	});

	it('returns to show edit button when form is submitted', () => {
		component.find('button').simulate('click');
		expect(component.find('button')).to.not.contain('Edit');
		expect(component.find('button')).to.contain('Submit');
		expect(component.find('button')).to.contain('Undo Changes');

		component.find('form').simulate('submit');

		expect(component.find('button')).to.contain('Edit');
		expect(component.find('button')).not.to.contain('Submit');
		expect(component.find('button')).not.to.contain('Undo Changes');
	});


});

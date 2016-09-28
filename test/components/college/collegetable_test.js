import { renderComponent, expect } from '../../test_helper';
import CollegeTable from '../../../app/client/src/components/college/CollegeTable';


describe('CollegeTable', () => {

	let component;

	beforeEach(() => {
		const props = {colleges: [{
						fullName: 'College 1',
						shortName: 'Col1'
						},
						{
						fullName: 'College 2',
						shortName: 'Col2'
						}]
						};

		component = renderComponent(CollegeTable, props);
	});
	
	it('has correct class', () => {
		expect(component).to.have.class('college-table');
	});

	it('shows fullName', () => {
		expect(component.find('tbody td')).to.contain('College 1');
	});

	it('shows shortName', () => {
		expect(component.find('tbody td')).to.contain('Col1');
	});


});

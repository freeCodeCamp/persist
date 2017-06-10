import { renderComponent, expect } from '../../test_helper';
import CollegeFilter from '../../../app/client/src/components/college/CollegeFilter';

describe('CollegeFilter', () => {
    let component;

    beforeEach(() => {
        component = renderComponent(CollegeFilter);
    });

    it('has correct id', () => {
        expect(component).to.have.id('college-filter');
    });

    it('has a full name field', () => {
        expect(component.find("input[name='fullName']")).to.exist;
    });

    it('has a submit button', () => {
        expect(component.find('button[type="submit"]')).to.exist;
    });
});

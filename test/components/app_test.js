import { renderComponent, expect } from '../test_helper';
import App from '../../src/components/App';

//mocha lines these functions up within functions - then if errors, it will still continue as is a testing suite
//wont destroy program 

// Use 'describe' to group together similar tests - string for output - stay name of component
describe('App', () => {

	let component;

	beforeEach(() => {
		component = renderComponent(App);
	})

	//does it show child component?
	it('shows a comment box', () => {
		expect(component.find('.comment-box')).to.exist;
	});

	it('should show a comment list', () => {
		expect(component.find('.comment-list')).to.exist;
	});

});

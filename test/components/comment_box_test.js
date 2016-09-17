import { renderComponent, expect} from '../test_helper';
import CommentBox from '../../src/components/comment_box';

//mocha

//first run - lines up
//second run - runs function
//initialise any code outside of it
//runs before each
//then run tests

describe('CommentBox', () => {

	let component;

	beforeEach(() => {
		component = renderComponent(CommentBox);
	});

	describe('presentation', () => {

		it('has correct class', () => {
			expect(component).to.have.class('comment-box');
		});

		it('has a text area', ()  => {
			expect(component.find('textarea')).to.exist;
		});

		it('has a button', () => {
			expect(component.find('button')).to.exist;
		});

	});

	describe('entering text', () => {

		let text;

		beforeEach(() => {
			text = 'sample text';
			component.find('textarea').simulate('change', text);
		});

		it('shows text in text area', () => {
			expect(component.find('textarea')).to.have.value(text);
		});

		it('clears text when submitted', () => {
			component.simulate('submit');
			expect(component.find('textarea')).to.have.value('');
		});

	});

	

});